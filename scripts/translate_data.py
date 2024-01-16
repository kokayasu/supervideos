#!/usr/bin/env python3
import pandas as pd
import os
import boto3
import utils
import logging

AWS_REGION = os.getenv("AWS_REGION", "us-west-1")
MAX_TRANSLATE_NUM_CHAR = 500


translate_client = boto3.client("translate", region_name=AWS_REGION)


def translate_text(text, source_lang, target_lang):
    response = translate_client.translate_text(
        Text=text, SourceLanguageCode=source_lang, TargetLanguageCode=target_lang
    )
    return response["TranslatedText"]


def translate():
    utils.configure_logging()
    current_csv = utils.find_nearest_past_csv("pornhub")
    df = pd.read_csv(current_csv)
    before_non_empty_titles_count = df["title_ja"].notna().sum()
    logging.info(
        f"Before Number of rows where 'title_ja' is not empty: {before_non_empty_titles_count}"
    )

    translation_dict = {}
    char_count = 0
    df = df.sort_values(by="view_count", ascending=False)
    for index, row in df[
        (df["title_ja"].isnull()) & (~df["title_en"].isnull())
    ].iterrows():
        vid = row["id"]
        title_en = row["title_en"]
        translated_text = translate_text(title_en, "en", "ja")
        translation_dict[vid] = translated_text
        logging.info(f"{vid} is translated to '{translated_text}' from '{title_en}'")
        char_count += len(title_en)
        if char_count >= MAX_TRANSLATE_NUM_CHAR:
            break
    df["title_ja"] = df.apply(
        lambda row: translation_dict.get(str(row["id"]), row["title_ja"]), axis=1
    )
    non_empty_titles_count = df["title_ja"].notna().sum()
    logging.info(
        f"After Number of rows where 'title_ja' is not empty: {non_empty_titles_count}"
    )
    logging.info(
        f"{non_empty_titles_count - before_non_empty_titles_count} videos are translated"
    )

    output_path = current_csv.replace(".csv", "_translation.csv")
    df.to_csv(output_path, index=False)
    logging.info(f"Output in {output_path}")


if __name__ == "__main__":
    translate()
