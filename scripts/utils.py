#!/usr/bin/env python3
import requests
import zipfile
import logging
import datetime
import csv
from lingua import Language, LanguageDetectorBuilder
import os
import pandas as pd

DATA_DIR = "./data"

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
    logging.info(f"Checking if unzipped file already exists in {destination_dir}")
    file_name = os.path.join(
        destination_dir, os.path.splitext(os.path.basename(zip_file_path))[0] + ".csv"
    )
    if os.path.exists(file_name):
        logging.info(f"File '{file_name}' already exists. Skipping download.")
        return file_name

    logging.info(f"Unzip {zip_file_path}")
    with zipfile.ZipFile(zip_file_path, "r") as zip_ref:
        zip_ref.extractall(destination_dir)
        first_file_name = zip_ref.namelist()[0]
    logging.info(
        f"File '{zip_file_path}' successfully extracted to '{destination_dir}'."
    )
    return f"{destination_dir}/{first_file_name}"


def find_nearest_past_csv(data_prodider):
    directory = f"{DATA_DIR}/{data_prodider}"
    csv_files = [f for f in os.listdir(directory) if f.endswith(".csv")]
    if not csv_files:
        return None
    nearest_past_csv = max(csv_files)
    return os.path.join(directory, nearest_past_csv)


def get_current_data_title_ja(df, vid):
    try:
        title_ja = df.loc[vid, "title_ja"]
        if pd.isna(title_ja):
            return None
        return title_ja
    except KeyError:
        return None


def generate_data_csv(db_file_path, data_prodider, parse_line):
    destination_dir = f"{DATA_DIR}/{data_prodider}"
    os.makedirs(destination_dir, exist_ok=True)
    output_file_path = f"{destination_dir}/{generate_current_day_str()}.csv"
    logging.info(f"Checking if '{output_file_path}'already exists")
    if os.path.exists(output_file_path):
        logging.info(
            f"File '{output_file_path}' already exists. Skipping generating the csv file."
        )
        return output_file_path

    current_data_csv = find_nearest_past_csv(data_prodider)
    current_data_df = None
    if current_data_csv:
        logging.info(f"'{current_data_csv}' is used as the current data CSV")
        current_data_df = pd.read_csv(current_data_csv)
        current_data_df.set_index("id", inplace=True)
    else:
        logging.warning("Could not find the past data CSV file.")

    BATCH_SIZE = 100000
    count = 0
    logging.info(f"Start generating data csv file, {output_file_path}")
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
        writer = csv.DictWriter(output_file, fieldnames=header_order)
        writer.writeheader()

        batch = []
        while True:
            line = input_file.readline().strip()
            if not line:
                break

            try:
                row = parse_line(line)
                current_data_title_ja = get_current_data_title_ja(
                    current_data_df, row["id"]
                )
                if not row["title_ja"] and current_data_title_ja:
                    row["title_ja"] = current_data_title_ja

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
