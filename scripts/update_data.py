#!/usr/bin/env python3
import pandas as pd
import utils
import logging
from opensearchpy import OpenSearch
import ast
import generate_data_csv_pornhub
import generate_data_csv_xvideos

utils.configure_logging()

OPENSEARCH_HOST = (
    "search-videopurple-uwhp3imf4bgstzu3h4rpxxb2oi.us-west-2.es.amazonaws.com"
)
USERNAME = "videopurple"
# OPENSEARCH_HOST = (
#     "search-videopurple-test-qz6qdmolhry4o42bix3j77pfe4.us-west-2.es.amazonaws.com"
# )
# USERNAME = "videopurple-test"
PORT = 443
PASSWORD = "NA7vF9j!"
VIDEOS_INDEX_NAME = "videos"
BULK_SIZE = 5000

client = OpenSearch(
    hosts=[{"host": OPENSEARCH_HOST, "port": PORT}],
    http_compress=True,
    http_auth=(USERNAME, PASSWORD),
    use_ssl=True,
    timeout=300,
    retry_on_conflict=10,
)


def compare_rows(row1, row2):
    differences = {
        col: (row1[col], row2[col])
        for col in row1.index
        if row1[col] != row2[col] and not (pd.isna(row1[col]) and pd.isna(row2[col]))
    }
    return differences


def bulk_delete(df):
    logging.info("Bulk delete start")
    batch_data = []
    for index, row in df.iterrows():
        batch_data.append('{{"delete": {{"_id": "{}"}}}}'.format(row["id"]))
        if len(batch_data) == BULK_SIZE:
            client.bulk("\n".join(batch_data), index=VIDEOS_INDEX_NAME)
            batch_data = []
    if len(batch_data) > 0:
        client.bulk("\n".join(batch_data), index=VIDEOS_INDEX_NAME)
    logging.info("Bulk delete end")


def bulk_insert(df):
    logging.info("Bulk insert start")
    batch_data = []
    for index, row in df.iterrows():
        non_null_columns = {key: value for key, value in row.items() if pd.notna(value)}
        non_null_columns["id"] = str(non_null_columns["id"])
        non_null_columns["categories"] = ast.literal_eval(
            non_null_columns["categories"]
        )
        batch_data.append('{{"index": {{"_id": "{}"}}}}'.format(row["id"]))
        batch_data.append(pd.Series(non_null_columns).to_json(orient="columns"))
        if len(batch_data) == BULK_SIZE:
            client.bulk("\n".join(batch_data), index=VIDEOS_INDEX_NAME)
            batch_data = []
    if len(batch_data) > 0:
        client.bulk("\n".join(batch_data), index=VIDEOS_INDEX_NAME)
    logging.info("Bulk insert end")


def update_data():
    utils.configure_logging()
    current_csv = utils.find_nearest_past_csv("xvideos")
    # new_csv = generate_data_csv_pornhub.generate_data_csv()
    new_csv = generate_data_csv_xvideos.generate_data_csv()
    # current_csv = ".//data/pornhub/20240116_translation.csv"
    # new_csv = "./data/pornhub/20240119.csv"

    current = pd.read_csv(current_csv)
    new = pd.read_csv(new_csv)

    current.set_index("id", inplace=True)
    new.set_index("id", inplace=True)

    ids_only_in_current_list = list(set(current.index) - set(new.index))
    rows_only_in_current = current.loc[ids_only_in_current_list].reset_index()
    bulk_delete(rows_only_in_current)

    ids_only_in_new_list = list(set(new.index) - set(current.index))
    rows_only_in_new = new.loc[ids_only_in_new_list].reset_index()
    bulk_insert(rows_only_in_new)

    common_ids = set(current.index) & set(new.index)
    common_ids_list = list(common_ids)
    rows_common_to_both = new.loc[common_ids_list].reset_index()
    bulk_insert(rows_common_to_both)


if __name__ == "__main__":
    update_data()
