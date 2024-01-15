#!/usr/bin/env python3
import csv
import json
import os


def tsv_to_opensearch(input_file, index_name, operations_per_file=20000):
    # Read TSV and convert to list of dictionaries
    with open(input_file, "r", newline="", encoding="utf-8") as tsvfile:
        reader = csv.DictReader(tsvfile, delimiter="\t")
        data = []
        for row in reader:
            # Convert numerical columns to integers
            row["view_count"] = int(row["view_count"])
            row["like_count"] = int(row["like_count"])
            row["dislike_count"] = int(row["dislike_count"])

            # Convert the 'categories' column to a list
            row["categories"] = [
                category.strip("{}") for category in row["categories"].split(",")
            ]
            data.append(row)

    # Create a list of bulk insert operations
    bulk_operations = []
    for doc in data:
        # Extract _id field and remove it from the document
        doc_id = doc["id"]

        # Create a dictionary for the bulk operation
        bulk_op = {"index": {"_index": index_name, "_id": doc_id}}
        bulk_operations.append(bulk_op)
        bulk_operations.append(doc)

    # Create output directory if it doesn't exist
    output_dir = f"{index_name}_bulk_output"
    os.makedirs(output_dir, exist_ok=True)

    # Write the list of bulk operations to multiple JSON files
    for i in range(0, len(bulk_operations), operations_per_file):
        file_index = i // operations_per_file + 1
        output_file = os.path.join(output_dir, f"{index_name}_bulk_{file_index}.json")

        with open(output_file, "w", encoding="utf-8") as jsonfile:
            for op in bulk_operations[i : i + operations_per_file]:
                json.dump(op, jsonfile)
                jsonfile.write("\n")


tsv_to_opensearch(
    "./scripts/pornhub/20231225/bulk_insert.tsv",
    "videos",
    operations_per_file=20000,
)
