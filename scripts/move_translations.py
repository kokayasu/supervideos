#!/usr/bin/env python3
import pandas as pd

# Load tsv_file into a DataFrame
tsv_df = pd.read_csv("./scripts/pornhub/20240109/test.tsv", sep="\t")

# Load translations.txt into a dictionary for quick lookup
translations = {}
with open("translate.txt", "r") as file:
    for line in file:
        line = line.strip().split("|")
        translations[line[0].strip()] = line[1].strip()

# Update 'translation' column in tsv_df
tsv_df["title_ja"] = tsv_df["id"].map(translations)
tsv_df.to_csv("./scripts/pornhub/20240109/test_2.tsv", sep="\t", index=False)
