#!/usr/bin/env python
import os
import requests
from collections import Counter
from bs4 import BeautifulSoup
import zipfile
import logging
import csv
import psycopg2
import pandas as pd
import boto3
import datetime
import re
from lingua import Language, LanguageDetectorBuilder
from collections import defaultdict
import json

BUCKET_NAME = "db_data"
URL = "https://www.pornhub.com/files/pornhub.com-db.zip"
BULK_INSERT_TSV = "bulk_insert.tsv"
CATEGORY_TABLE_TSV = "category_table.tsv"
DB_DATA_DIR = "pornhub"
DB_PARAMS = {
    "host": "localhost",
    "port": "5432",
    "database": "supervideos",
    "user": "postgres",
    "password": "postgres",
}
# DB_PARAMS = {
#     "host": "database-1.c7pdgnl5hc90.us-west-1.rds.amazonaws.com",
#     "port": "5432",
#     "database": "supervideos",
#     "user": "postgres",
#     "password": "5ZacDYV4eBaXflrQfNJU",
# }


def download_db_file(url, destination_dir):
    class DownloadError(Exception):
        pass

    logging.info(f"Download file from {url}")
    try:
        with requests.get(url, stream=True) as response:
            if response.status_code == 200:
                file_name = f"{destination_dir}/{os.path.basename(url)}"
                with open(file_name, "wb") as file:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            file.write(chunk)
                logging.info(f"File '{file_name}' downloaded successfully.")
                return file_name
            else:
                raise DownloadError(
                    f"Failed to download the file. Status code: {response.status_code}"
                )
    except requests.exceptions.RequestException as e:
        raise e


def unzip_db_file(zip_file_path, destination_dir):
    logging.info(f"Unzip {zip_file_path}")
    with zipfile.ZipFile(zip_file_path, "r") as zip_ref:
        zip_ref.extractall(destination_dir)
        first_file_name = zip_ref.namelist()[0]
    logging.info(
        f"File '{zip_file_path}' successfully extracted to '{destination_dir}'."
    )
    return f"{destination_dir}/{first_file_name}"


def load_category_table_tsv(cateogry_table_tsv_file_path):
    category_dict = {}
    with open(cateogry_table_tsv_file_path, newline="") as tsv_file:
        tsv_reader = csv.DictReader(tsv_file, delimiter="\t")
        for row in tsv_reader:
            name_en = row["name_en"]
            id_value = row["id"]
            category_dict[name_en] = id_value
    return category_dict


def load_category_mappings_json(cateogry_mapping_json_path):
    with open(cateogry_mapping_json_path, "r") as json_file:
        json_data = json.load(json_file)
        return json_data


def generate_bulk_insert_tsv_file(
    db_file_path, category_mappings_json_path, destination_dir
):
    BATCH_SIZE = 10000
    languages = [
        Language.ENGLISH,
        Language.FRENCH,
        Language.SPANISH,
        Language.JAPANESE,
        Language.KOREAN,
        Language.CHINESE,
        Language.THAI,
        Language.RUSSIAN,
        Language.ARABIC,
    ]
    language_mapping = {
        Language.ENGLISH: "en",
        Language.FRENCH: "fr",
        Language.SPANISH: "es",
        Language.JAPANESE: "ja",
        Language.KOREAN: "kr",
        Language.CHINESE: "ch",
        Language.THAI: "th",
        Language.RUSSIAN: "ru",
        Language.ARABIC: "ar",
        # Add more language codes and their string representations as needed
    }

    detector = LanguageDetectorBuilder.from_languages(*languages).build()
    translater = boto3.client("translate")
    category_id_mapping = load_category_mappings_json(category_mappings_json_path)

    count = 0
    output_file_path = f"{destination_dir}/{BULK_INSERT_TSV}"
    logging.info(f"Start generating bulk insert tsv file, {output_file_path}")
    stat = defaultdict(list)

    with open(db_file_path, "r") as input_file, open(
        output_file_path, "w", newline=""
    ) as output_file:
        header_order = [
            "id",
            "source_id",
            "thumbnail",
            "view_count",
            "like_count",
            "dislike_count",
            "created_at",
            "duration",
            "resolution",
            "categories",
            "title_orig_locale",
            "title_orig",
            "title_en",
            "title_ja",
        ]

        writer = csv.writer(output_file, delimiter="\t")
        writer.writerow(header_order)

        batch = []

        while True:
            line = input_file.readline()
            if not line:
                break

            count += 1
            tokens = line.split("|")
            src = BeautifulSoup(tokens[0], "html.parser").iframe["src"]
            id = src.rsplit("/", 1)[-1]
            thumbnail = tokens[1]
            title = tokens[3].replace("/", "").replace("\\", "")
            title_locale = language_mapping.get(
                detector.detect_language_of(title), "Unknown"
            )
            stat[title_locale].append(title)

            title_en = ""
            if title_locale == "en":
                title_en = title
            title_ja = ""
            if title_locale == "ja":
                title_ja = title
            # labels = tokens[4].split(";")
            category_ids = []
            for category in tokens[5].split(";"):
                category_id = category_id_mapping.get(category, "")
                if category_id != "":
                    category_ids.append(category_id)
            categories = "{" + ",".join(category_ids) + "}"
            view_count = int(tokens[8]) if tokens[8] != "" else 0
            like_count = int(tokens[9]) if tokens[9] != "" else 0
            dislike_count = int(tokens[10]) if tokens[10] != "" else 0

            # Create a list with the values and write it to the TSV file
            row = [
                id,
                "0",
                thumbnail,
                view_count,
                like_count,
                dislike_count,
                "",
                "",
                "",
                categories,
                title_locale,
                title,
                title_en,
                title_ja,
            ]
            batch.append(row)

            if len(batch) >= BATCH_SIZE:
                count += len(batch)
                logging.info(f"{count} records processed")
                writer.writerows(batch)
                batch = []

        if batch:
            writer.writerows(batch)

    # with open("test.json", "w") as output_file:
    #     json.dump(stat, output_file, indent=4, ensure_ascii=False)

    logging.info(f"Generated bulk insert TSV file, {output_file_path}")
    return output_file_path


def upload_file_to_s3(file_path):
    s3 = boto3.client("s3")
    s3.upload_file(file_path, BUCKET_NAME, file_path)


def download_file_from_s3(date_str, destination_dir):
    file_path = f"{destination_dir}/{date_str}/{BULK_INSERT_TSV}"
    if os.path.exists(file_path):
        logging.info(f"The file {file_path} already exists, won't download the file")
    else:
        logging.info(f"Start updating the db")
        os.makedirs(os.path.dirname(file_path))
        s3 = boto3.client("s3")
        s3.download_file(BUCKET_NAME, file_path, file_path)


def generate_current_day_str():
    current_date = datetime.datetime.now()
    return current_date.strftime("%Y%m%d")


def generate_previus_day_str(current_date_str):
    formatted_date = datetime.datetime.strptime(current_date_str, "%Y%m%d")
    previous_day = formatted_date - datetime.timedelta(days=1)
    return previous_day.strftime("%Y%m%d")


def update_db(current_tsv_file_path, previous_tsv_file_path):
    logging.info(f"Start updating the db")
    if previous_tsv_file_path == "":
        return

    previous_data = pd.read_csv(previous_tsv_file_path, delimiter="\t")
    current_data = pd.read_csv(current_tsv_file_path, delimiter="\t")

    current_data_keys = set(current_data["key"])
    previous_data_keys = set(previous_data["key"])

    added_data_keys = current_data_keys - previous_data_keys
    print(f"Added: {len(added_data_keys)}")

    deleted_data_keys = previous_data_keys - current_data_keys
    print(f"Deleted: {len(deleted_data_keys)}")

    common_keys = current_data_keys & previous_data_keys
    print(f"Num Common Keys: {len(common_keys)}")
    for key in common_keys:
        previous_row = previous_data[previous_data["key"] == key]
        current_row = current_data[current_data["key"] == key]

        if not previous_row.equals(current_row):
            print(f"Row with key {key} is different.")
            print(previous_row.to_string(index=False))
            print(current_row.to_string(index=False))
            break

    logging.info(f"Updated the db")


def generate_category_table_tsv_file(
    db_file_path, category_mappings_json_path, destination_dir
):
    category_counter = Counter()
    output_file_path = f"{destination_dir}/{CATEGORY_TABLE_TSV}"
    logging.info(f"Start generating Category table TSV file, {output_file_path}")

    category_id_mapping = load_category_mappings_json(category_mappings_json_path)
    with open(db_file_path, "r") as input_file:
        while True:
            line = input_file.readline()
            if not line:
                break

            tokens = line.split("|")
            for category in tokens[5].split(";"):
                category_id = category_id_mapping.get(category, "")
                if category_id != "":
                    category_counter[category_id] += 1

    with open(output_file_path, "w", newline="") as output_file:
        writer = csv.writer(output_file, delimiter="\t")
        writer.writerow(["id", "video_count", "name_en", "name_ja"])

        # Write the category counts
        for category_id, count in sorted(
            category_counter.items(), key=lambda x: x[1], reverse=True
        ):
            writer.writerow([category_id, count, category, ""])

    logging.info(f"Generated Category table TSV file, {output_file_path}")
    return output_file_path


def run_copy_command(tsv_file_path, table_name):
    logging.info(f"Start the bulk insert")
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()

    copy_command = f"COPY {table_name} FROM STDIN WITH CSV HEADER DELIMITER E'\\t'"
    with open(tsv_file_path, "r") as f:
        cur.copy_expert(sql=copy_command, file=f)

    conn.commit()
    logging.info(f"Data from {tsv_file_path} inserted into videos successfully.")


def count_categories(db_file_path, destination_dir):
    stat = Counter()
    with open(db_file_path, "r") as input_file:
        while True:
            line = input_file.readline()
            if not line:
                break

            tokens = line.split("|")
            for category in tokens[5].split(";"):
                stat[category] += 1
                pass

    with open("count.json", "w") as output_file:
        json.dump(stat, output_file, indent=4, ensure_ascii=False)


def main():
    logging.basicConfig(
        level=logging.INFO,  # Set the desired log level
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler()],  # Log to the console
    )

    # # Setup variables and directory
    # current_day_str = generate_current_day_str()
    # destination_dir = f"{DB_DATA_DIR}/{current_day_str}"
    # downloaded_file = download_db_file(URL, destination_dir)
    # os.makedirs(destination_dir, exist_ok=True)

    # # # Unzip the db file
    # unziped_db_file = unzip_db_file(downloaded_file, destination_dir)

    # category_table_tsv_file_path = generate_category_table_tsv_file(
    #     unziped_db_file, "./pornhub/category_mappings.json", destination_dir
    # )
    # run_copy_command(category_table_tsv_file_path, "categories")
    #
    # current_tsv_file_path = generate_bulk_insert_tsv_file(
    #     unziped_db_file, "./pornhub/category_mappings.json", destination_dir
    # )
    current_tsv_file_path = "./pornhub/20231202/bulk_insert.tsv"
    run_copy_command(current_tsv_file_path, "videos")


if __name__ == "__main__":
    main()
