#!/usr/bin/env python3
import requests
import zipfile
import logging
import datetime
import csv
from lingua import Language, LanguageDetectorBuilder
import psycopg2
import os


DB_PARAMS = {
    "host": "localhost",
    "port": "5432",
    "database": "videopurple",
    "user": "postgres",
    "password": "postgres",
}
# DB_PARAMS = {
#     "host": "database-1.c7pdgnl5hc90.us-west-1.rds.amazonaws.com",
#     "port": "5432",
#     "database": "videopurple",
#     "user": "postgres",
#     "password": "5ZacDYV4eBaXflrQfNJU",
# }
#
DB_PARAMS = {
    "host": "database-videopurple.cozew38zohgv.us-west-2.rds.amazonaws.com",
    "port": "5432",
    "database": "videopurple",
    "user": "postgres",
    "password": "IDlRxHLZtUmInuNLk8rF",
}

CATEGORY_TRANSLATION_JSON_PATH = "./src/categoryTranslations.json"


def configure_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(),
        ],
    )


def generate_current_day_str():
    current_date = datetime.datetime.now()
    return current_date.strftime("%Y%m%d")


def download_db_file(url, destination_dir):
    class DownloadError(Exception):
        pass

    logging.info(f"Checking if file already exists in {destination_dir}")
    file_name = os.path.join(destination_dir, os.path.basename(url))

    if os.path.exists(file_name):
        logging.info(f"File '{file_name}' already exists. Skipping download.")
        return file_name

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


def generate_bulk_insert_tsv_file(db_file_path, destination_dir, parse_line):
    logging.info(
        f"Checking if bulk_insert_tsv_file already exists in {destination_dir}"
    )
    file_name = os.path.join(destination_dir, "bulk_insert.tsv")
    if os.path.exists(file_name):
        logging.info(
            f"File '{file_name}' already exists. Skipping generating the tsv file."
        )
        return file_name

    BATCH_SIZE = 100000
    count = 0
    output_file_path = f"{destination_dir}/bulk_insert.tsv"
    logging.info(f"Start generating bulk insert tsv file, {output_file_path}")
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
            line = input_file.readline().strip()
            if not line:
                break

            try:
                parsed_line = parse_line(line)
                row = [
                    parsed_line["id"],
                    parsed_line["source_id"],
                    parsed_line["thumbnail"],
                    parsed_line["view_count"],
                    parsed_line["like_count"],
                    parsed_line["dislike_count"],
                    parsed_line["created_at"],
                    parsed_line["duration"],
                    parsed_line["resolution"],
                    "{" + ",".join(parsed_line["categories"]) + "}",
                    parsed_line["title_orig_locale"],
                    parsed_line["title_orig"],
                    parsed_line["title_en"],
                    parsed_line["title_ja"],
                ]
                batch.append(row)

                if len(batch) == BATCH_SIZE:
                    count += len(batch)
                    logging.info(f"{count} records processed {db_file_path}")
                    writer.writerows(batch)
                    batch = []
            except Exception as e:
                logging.warning(f"'{line}' has an issue with '{e}'")
        if batch:
            writer.writerows(batch)
    return output_file_path


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
}

detector = LanguageDetectorBuilder.from_languages(*languages).build()


def get_locale(title):
    return language_mapping.get(detector.detect_language_of(title), "")


def split_csv(input_file, chunk_size, output_dir):
    with open(input_file, "r", newline="") as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)
        file_count = 0
        current_chunk = []
        current_chunk_size = 0

        for row in reader:
            current_chunk.append(row)
            current_chunk_size += 1

            if current_chunk_size >= chunk_size:
                output_file = os.path.join(output_dir, f"chunk_{file_count + 1}.csv")
                with open(output_file, "w", newline="") as chunk_file:
                    writer = csv.writer(chunk_file)
                    writer.writerow(header)
                    writer.writerows(current_chunk)

                # Reset variables for the next chunk
                current_chunk = []
                current_chunk_size = 0
                file_count += 1

        if current_chunk:
            output_file = os.path.join(output_dir, f"chunk_{file_count + 1}.csv")
            with open(output_file, "w", newline="") as chunk_file:
                writer = csv.writer(chunk_file)
                writer.writerow(header)
                writer.writerows(current_chunk)

    split_files = [
        os.path.join(output_dir, f"chunk_{i + 1}.csv") for i in range(file_count + 1)
    ]
    return split_files


def run_copy_command(tsv_file_path, table_name):
    logging.info(f"Start the bulk insert with {tsv_file_path}")
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()

    copy_command = f"COPY {table_name} FROM STDIN WITH CSV HEADER DELIMITER E'\\t'"
    with open(tsv_file_path, "r") as f:
        cur.copy_expert(sql=copy_command, file=f)

    conn.commit()
    logging.info(f"Data from {tsv_file_path} inserted into videos successfully.")


def split_and_run_copy_command(tsv_file_path, table_name, output_dir):
    logging.info(f"Split {tsv_file_path} and run copy command")
    for csv_path in split_csv(tsv_file_path, 10000, output_dir):
        run_copy_command(csv_path, table_name)
    logging.info("Done all copies")


def count_categories(tsv_file_path):
    category_counts = {}

    with open(tsv_file_path, "r", newline="", encoding="utf-8") as tsv_file:
        reader = csv.DictReader(tsv_file, delimiter="\t")
        for row in reader:
            categories = row.get("categories")[1:-1].split(",")
            for category in categories:
                category = category.strip()
                if category == "":
                    continue
                if category not in category_counts:
                    category_counts[category] = {"en": 0, "ja": 0}
                if row.get("title_en") != "":
                    category_counts[category]["en"] += 1
                if row.get("title_ja") != "":
                    category_counts[category]["ja"] += 1
    return category_counts


def update_categories_table(tsv_file_path):
    logging.info("Update categories table")
    connection = psycopg2.connect(**DB_PARAMS)
    cursor = connection.cursor()

    category_counts = count_categories(tsv_file_path)
    for category, counts in category_counts.items():
        if category == "japanese":
            print(f"{counts}")
        for locale, count in counts.items():
            cursor.execute(
                "SELECT count FROM categories WHERE category = %s AND locale = %s",
                (category, locale),
            )
            result = cursor.fetchone()

            if result:
                cursor.execute(
                    "UPDATE categories SET count = count + %s WHERE category = %s AND locale = %s",
                    (count, category, locale),
                )
            else:
                cursor.execute(
                    "INSERT INTO categories (category, locale, count) VALUES (%s, %s, %s)",
                    (category, locale, count),
                )

    connection.commit()
    connection.close()
    logging.info("Done updating categories table")
