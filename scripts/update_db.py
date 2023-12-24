#!/usr/bin/env python3
import pandas as pd


def compare_csv(current_path, new_path):
    # Specify the data type for columns, e.g., dtype=str for all columns
    current_df = pd.read_csv(current_path, sep="\t", dtype=str)
    new_df = pd.read_csv(new_path, sep="\t", dtype=str)

    # Merge DataFrames on 'id' column to find common rows
    merged_df = pd.merge(current_df, new_df, on="id", how="outer", indicator=True)

    # Create three groups
    to_delete = merged_df[merged_df["_merge"] == "left_only"]
    to_update = merged_df[merged_df["_merge"] == "both"]
    to_add = merged_df[merged_df["_merge"] == "right_only"]

    return to_delete, to_update, to_add


if __name__ == "__main__":
    current_path = "./scripts/xvideos/20231218/bulk_insert.tsv"
    new_path = "./scripts/xvideos/20231223/bulk_insert.tsv"

    to_delete, to_update, to_add = compare_csv(current_path, new_path)

    print("Rows to delete:")
    print(to_delete)

    print("\nRows to update:")
    print(to_update)

    print("\nRows to add:")
    print(to_add)
