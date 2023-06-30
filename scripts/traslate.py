#!/usr/bin/env python3
import os
import psycopg2
import boto3
import logging
from psycopg2 import sql

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

db_params = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}
db_params = {
    "host": "database-1.c7pdgnl5hc90.us-west-1.rds.amazonaws.com",
    "port": "5432",
    "database": "videopurple",
    "user": "postgres",
    "password": "5ZacDYV4eBaXflrQfNJU",
}

AWS_REGION = os.getenv("AWS_REGION", "us-west-1")


def translate_text(text, source_lang, target_lang, region):
    # Initialize the AWS Translate client
    translate_client = boto3.client("translate", region_name=region)

    # Translate the text
    response = translate_client.translate_text(
        Text=text, SourceLanguageCode=source_lang, TargetLanguageCode=target_lang
    )

    # Return the translated text
    return response["TranslatedText"]


def update_translations(limit):
    logging.info("Start translating titles")

    # Establish a connection to the PostgreSQL database
    with psycopg2.connect(**db_params) as connection:
        try:
            # Create a cursor to execute SQL queries
            with connection.cursor() as cursor:
                total_ch = 0
                done = False
                while not done:
                    query = sql.SQL(
                        """
                        SELECT id, title_en
                        FROM videos
                        WHERE title_en IS NOT NULL AND title_ja IS NULL
                        ORDER BY view_count DESC
                        LIMIT %s;
                    """
                    )
                    cursor.execute(query, (1000,))
                    rows = cursor.fetchall()

                    for video_id, title_en in rows:
                        total_ch += len(title_en)
                        if total_ch >= limit:
                            logging.info(
                                "Stopped translating because the total translated character will exceed the limit"
                            )
                            done = True
                            break

                        translated_title_ja = translate_text(
                            title_en, "en", "ja", AWS_REGION
                        )
                        update_query = sql.SQL(
                            """
                            UPDATE videos
                            SET title_ja = %s
                            WHERE id = %s;
                        """
                        )
                        cursor.execute(update_query, (translated_title_ja, video_id))
                        connection.commit()
                        logging.info(f"Updated translation for video ID {video_id}")

        except psycopg2.Error as e:
            logging.error(f"Error updating translations: {e}")


def lambda_handler(event, context):
    update_translations(650000)


if __name__ == "__main__":
    lambda_handler(None, None)
