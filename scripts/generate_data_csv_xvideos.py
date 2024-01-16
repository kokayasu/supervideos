#!/usr/bin/env python3
import sys
import os
import json
from bs4 import BeautifulSoup
import utils

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(project_root)
utils.configure_logging()

URL = "https://webmaster-tools.xvideos.com/xvideos.com-export-full.csv.zip"
RAW_DATA_DIR = "./raw/xvideos"


class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False
        self.category = None


def insert_category(root, category):
    node = root
    for char in category:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
    node.is_end_of_word = True
    node.category = category


def find_category(root, candidate):
    mapping = {"a": "1"}
    if candidate in mapping:
        return mapping[candidate]

    candidate = candidate.lower().replace("_", "-")

    node = root
    for char in candidate:
        if char not in node.children:
            return None
        node = node.children[char]
        if node.is_end_of_word:
            return node.category
    return None


def generate_categories_tri_from_json():
    json_file_path = f"{project_root}/src/categoryTranslations.json"
    with open(json_file_path, "r") as json_file:
        categories = json.load(json_file)
    trie_root = TrieNode()
    for category in categories:
        insert_category(trie_root, category)
    return trie_root


categories_tri = generate_categories_tri_from_json()


def parse_line(line):
    tokens = line.split(";")
    title = tokens[1]
    duration = int(tokens[2].split(" ")[0])
    thumbnail = tokens[3]
    iframe = tokens[4]
    src = BeautifulSoup(iframe, "html.parser").iframe["src"]
    vid = src.rsplit("/", 1)[-1]
    tags = tokens[5].split(",")
    view_count = tokens[7]
    token_category = tokens[8]
    resolution = tokens[9]

    categories = []
    category = find_category(categories_tri, token_category)
    if category is not None:
        categories.append(category)
    for tag in tags:
        category = find_category(categories_tri, tag)
        if category is not None and category not in categories:
            categories.append(category)
    title_locale = utils.get_locale(title)
    title_en = title if title_locale == "en" else None
    title_ja = title if title_locale == "ja" else None

    return {
        "id": str(1) + vid,
        "source_id": 1,
        "thumbnail": thumbnail,
        "view_count": view_count,
        "like_count": 0,
        "dislike_count": 0,
        "created_at": None,
        "duration": duration,
        "resolution": resolution,
        "categories": categories,
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
    data_csv_path = utils.generate_data_csv(unziped_db_file, "xvideos", parse_line)
    return data_csv_path


if __name__ == "__main__":
    generate_data_csv()
