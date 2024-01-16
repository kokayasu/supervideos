#!/usr/bin/env python3
from utils import configure_logging
from opensearchpy import OpenSearch
import concurrent.futures
import logging
import json
import ast
import pandas as pd
import generate_data_csv_pornhub as pornhub
import generate_data_csv_xvideos as xvideos

# OPENSEARCH_HOST = (
#     "search-videopurple-uwhp3imf4bgstzu3h4rpxxb2oi.us-west-2.es.amazonaws.com"
# )
# USERNAME = "videopurple"
OPENSEARCH_HOST = (
    "search-videopurple-test-qz6qdmolhry4o42bix3j77pfe4.us-west-2.es.amazonaws.com"
)
USERNAME = "videopurple-test"

PORT = 443
PASSWORD = "NA7vF9j!"
VIDEOS_INDEX_NAME = "videos"
VIDEOS_INDEX_SETTING_JSON_PATH = "./scripts/initialize_videos_index_mapping.json"

client = OpenSearch(
    hosts=[{"host": OPENSEARCH_HOST, "port": PORT}],
    http_compress=True,
    http_auth=(USERNAME, PASSWORD),
    use_ssl=True,
    timeout=30,
    retry_on_conflict=10,
)


def create_indexes():
    with open(VIDEOS_INDEX_SETTING_JSON_PATH, "r") as json_file:
        index_body = json.load(json_file)
    response = client.indices.create(VIDEOS_INDEX_NAME, body=index_body)
    logging.info(response)


def bulk_insert(csv_file_path):
    batch_size = 10000 * 2  # * 2 bacause two lines are one set
    batch_data = []
    df = pd.read_csv(csv_file_path)
    for index, row in df.iterrows():
        non_null_columns = {key: value for key, value in row.items() if pd.notna(value)}
        non_null_columns["id"] = str(non_null_columns["id"])
        non_null_columns["categories"] = ast.literal_eval(
            non_null_columns["categories"]
        )
        batch_data.append(
            '{{"index": {{"_index": "{}", "_id": "{}"}}}}'.format(
                VIDEOS_INDEX_NAME, row["id"]
            )
        )
        batch_data.append(pd.Series(non_null_columns).to_json(orient="columns"))
        if len(batch_data) == batch_size:
            client.bulk("\n".join(batch_data))
            batch_data = []
    if len(batch_data) > 0:
        client.bulk("\n".join(batch_data))


def pornhub_populate_video_index():
    try:
        return pornhub.generate_data_csv()
    except Exception as e:
        logging.error(f"Exception occurred in pornhub_populate_video_index: {e}")
        raise e


def xvideos_populate_video_index():
    try:
        return xvideos.generate_data_csv()
    except Exception as e:
        logging.error(f"Exception occurred in xvideos_populate_video_index: {e}")
        raise e


def populate_videos_index():
    with concurrent.futures.ProcessPoolExecutor(max_workers=2) as executor:
        futures = [
            executor.submit(pornhub_populate_video_index),
            # executor.submit(xvideos_populate_video_index),
        ]
        concurrent.futures.wait(futures)

        csv_files = []
        for future in concurrent.futures.as_completed(futures):
            try:
                csv_files.append(future.result())
            except Exception as e:
                logging.error(f"Exception occurred: {e}")
                raise e
        for csv_file in csv_files:
            bulk_insert(csv_file)


def populate_pagination_info(locale):
    PAGE_SIZE = 1000
    query = {
        "query": {"exists": {"field": f"title_{locale}"}},
        "size": PAGE_SIZE,
        "sort": [{"id": "asc"}],
    }

    page = 2
    batch_size = 1000
    batch_data = []
    while True:
        response = client.search(body=query, index=VIDEOS_INDEX_NAME)
        if not response["hits"]["hits"]:
            break

        last_id_value = response["hits"]["hits"][-1]["sort"][0]
        query["search_after"] = [last_id_value]
        logging.info(f"Found last_id_value {last_id_value} for page {page}")
        batch_data.append(
            '{{"index": {{"_index": "{}", "_id": "{}"}}}}'.format(
                f"pagination_info_{locale}", page
            )
        )
        batch_data.append(json.dumps({"last_id_value": last_id_value}))
        page += 1

        if len(batch_data) == batch_size:
            client.bulk("\n".join(batch_data))
            batch_data = []
    if len(batch_data) > 0:
        client.bulk("\n".join(batch_data))
        batch_data = []


if __name__ == "__main__":
    configure_logging()
    # create_indexes()
    populate_videos_index()
    # populate_pagination_info("ja")
    # populate_pagination_info("en")
