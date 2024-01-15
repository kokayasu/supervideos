#!/usr/bin/env python3
import sys
import os
from bs4 import BeautifulSoup
import json

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(project_root)

from scripts.utils import (
    configure_logging,
    generate_current_day_str,
    download_db_file,
    unzip_db_file,
    generate_bulk_insert_tsv_file,
    generate_bulk_insert_csv,
    get_locale,
    run_copy_command,
    split_and_run_copy_command,
    count_categories,
    update_categories_table,
)

configure_logging()


URL = "https://www.pornhub.com/files/pornhub.com-db.zip"
DB_DATA_DIR = "pornhub"
CATEGORY_MAPPING_JSON_PATH = "./scripts/pornhub/category_mappings.json"


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
    title_locale = get_locale(title)
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


def run():
    current_day_str = generate_current_day_str()
    destination_dir = f"./scripts/{DB_DATA_DIR}/{current_day_str}"
    os.makedirs(destination_dir, exist_ok=True)
    downloaded_file = download_db_file(URL, destination_dir)
    unziped_db_file = unzip_db_file(downloaded_file, destination_dir)
    current_tsv_file_path = generate_bulk_insert_tsv_file(
        unziped_db_file, destination_dir, parse_line
    )
    run_copy_command(current_tsv_file_path, "videos")


def generate_bulk_insert_tsv():
    current_day_str = generate_current_day_str()
    destination_dir = f"./scripts/{DB_DATA_DIR}/{current_day_str}"
    os.makedirs(destination_dir, exist_ok=True)
    downloaded_file = download_db_file(URL, destination_dir)
    unziped_db_file = unzip_db_file(downloaded_file, destination_dir)
    current_tsv_file_path = generate_bulk_insert_tsv_file(
        unziped_db_file, destination_dir, parse_line
    )
    return current_tsv_file_path


# if __name__ == "__main__":
#     print(generate_bulk_insert_tsv())
