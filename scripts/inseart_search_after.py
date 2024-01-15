#!/usr/bin/env python3
from utils import configure_logging
from opensearchpy import OpenSearch
import logging
import json
import time

OPENSEARCH_HOST = (
    "search-videopurple-uwhp3imf4bgstzu3h4rpxxb2oi.us-west-2.es.amazonaws.com"
)
PORT = 443
USERNAME = "videopurple"
PASSWORD = "NA7vF9j!"
VIDEOS_INDEX_NAME = "videos"

client = OpenSearch(
    hosts=[{"host": OPENSEARCH_HOST, "port": PORT}],
    http_compress=True,
    http_auth=(USERNAME, PASSWORD),
    use_ssl=True,
    timeout=30,
    retry_on_conflict=10,
)

PAGE_SIZE = 1000


# def bulk_insert_retry(batch_data):
#     max_retry = 10
#     error = None
#     for i in range(max_retry):
#         try:
#             client.bulk("\n".join(batch_data))
#             error = None
#             break
#         except Exception as e:
#             error = e
#             sleep_time = 30 * (i + 1) ** 2
#             logging.error(
#                 f"Error happened. It will retry after {sleep_time} seconds. ({max_retry - i} retry left)"
#             )
#             time.sleep()
#     if error:
#         logging.error("Even retrying cause error")
#         logging.error(batch_data)
#         raise error


def populate_pagination_info(locale):
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


if __name__ == "__main__":
    configure_logging()
    populate_pagination_info("ja")
