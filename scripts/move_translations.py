#!/usr/bin/env python3
import psycopg2
from utils import configure_logging, DB_PARAMS
import logging

configure_logging()


translation_file_path = "./translate.txt"


def move_translations():
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    with open(translation_file_path, "r", encoding="utf-8") as file:
        for line in file:
            try:
                video_id, title_ja = line.strip().split("|", 1)
                video_id = video_id.strip()
                title_ja = title_ja.strip()

                sql = "UPDATE videos SET title_ja = %s WHERE id = %s"
                cursor.execute(sql, (title_ja, video_id))
                conn.commit()
                logging.info(f"Successfully updated ID {video_id}")
            except Exception as e:
                logging.error(f"Error updating ID {video_id}: {str(e)}")
                raise e
    cursor.close()
    conn.close()


if __name__ == "__main__":
    move_translations()
