#!/usr/bin/env python3
import pandas as pd
import math
import os


def convert_categories(categories_str):
    try:
        # Convert the set to a list of strings by splitting on commas
        categories_list = [
            category.strip() for category in categories_str[1:-1].split(",")
        ]
        return categories_list
    except (ValueError, SyntaxError):
        # Handle cases where the conversion fails
        return []


def create_bulk_insert_file(data, output_dir, chunk_size=10000):
    total_rows = len(data)
    num_chunks = math.ceil(total_rows / chunk_size)

    for i in range(num_chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, total_rows)
        chunk_data = data.iloc[start_idx:end_idx]

        bulk_insert_filename = os.path.join(output_dir, f"bulk_insert_{i + 1}.json")

        with open(bulk_insert_filename, "w") as bulk_file:
            for _, row in chunk_data.iterrows():
                if pd.notna(row["id"]):
                    bulk_file.write('{{"index": {{"_id": "{}"}}}}\n'.format(row["id"]))

                    # Filter out columns with null values before writing to the bulk file
                    non_null_columns = {
                        key: value if key != "categories" else convert_categories(value)
                        for key, value in row.items()
                        if pd.notna(value)
                    }
                    row["categories"] = convert_categories(row["categories"])
                    bulk_file.write(
                        pd.Series(non_null_columns).to_json(orient="columns") + "\n"
                    )


def main(input_file, output_dir):
    # Read TSV file into a Pandas DataFrame
    df = pd.read_csv(input_file, sep="\t")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Split data into chunks and create bulk insert files
    create_bulk_insert_file(df, output_dir)


if __name__ == "__main__":
    input_file = "./scripts/pornhub/20231225/bulk_insert.tsv"
    output_directory = "./bulk_insert"

    main(input_file, output_directory)
