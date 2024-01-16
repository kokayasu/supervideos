#!/usr/bin/env python3
import os
from bs4 import BeautifulSoup
import json
import utils

utils.configure_logging()


URL = "https://www.pornhub.com/files/pornhub.com-db.zip"
RAW_DATA_DIR = "./raw/pornhub"
CATEGORY_MAPPING_JSON_PATH = (
    "./scripts/generate_data_csv_pornhub_category_mappings.json"
)


def load_category_mappings_json(cateogry_mapping_json_path):
    with open(cateogry_mapping_json_path, "r") as json_file:
        json_data = json.load(json_file)
        return json_data


category_id_mapping = load_category_mappings_json(CATEGORY_MAPPING_JSON_PATH)


def parse_line(line):
    tokens = line.split("|")
    src = BeautifulSoup(tokens[0], "html.parser").iframe["src"]
    vid = src.rsplit("/", 1)[-1]
    thumbnail = tokens[1]
    title = tokens[3].replace("/", "").replace("\\", "")
    title_locale = utils.get_locale(title)
    title_en = title if title_locale == "en" else None
    title_ja = title if title_locale == "ja" else None
    # labels = tokens[4].split(";")
    category_ids = [
        category_id_mapping.get(category, "")
        for category in tokens[5].split(";")
        if category_id_mapping.get(category, "")
    ]
    view_count = int(tokens[8]) if tokens[8] != "" else 0
    like_count = int(tokens[9]) if tokens[9] != "" else 0
    dislike_count = int(tokens[10]) if tokens[10] != "" else 0

    return {
        "id": str(0) + vid,
        "source_id": 0,
        "thumbnail": thumbnail,
        "view_count": view_count,
        "like_count": like_count,
        "dislike_count": dislike_count,
        "created_at": None,
        "duration": None,
        "resolution": None,
        "categories": category_ids,
        "title_orig_locale": title_locale,
        "title_orig": title,
        "title_en": title_en,
        "title_ja": title_ja,
    }


def generate_data_csv():
    current_day_str = utils.generate_current_day_str()
    destination_dir = f"{RAW_DATA_DIR}/{current_day_str}"
    os.makedirs(destination_dir, exist_ok=True)
    downloaded_file = utils.download_db_file(URL, destination_dir)
    unziped_db_file = utils.unzip_db_file(downloaded_file, destination_dir)
    data_csv_path = utils.generate_data_csv(unziped_db_file, "pornhub", parse_line)
    return data_csv_path


if __name__ == "__main__":
    generate_data_csv()
