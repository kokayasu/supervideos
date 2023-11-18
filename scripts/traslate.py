#!/usr/bin/env python3
import psycopg2
import boto3
import logging

DB_PARAMS = {
    "host": "localhost",
    "port": "5432",
    "database": "supervideos",
    "user": "postgres",
    "password": "postgres",
}
# DB_PARAMS = {
#     "host": "database-1.c7pdgnl5hc90.us-west-1.rds.amazonaws.com",
#     "port": "5432",
#     "database": "supervideos",
#     "user": "postgres",
#     "password": "5ZacDYV4eBaXflrQfNJU",
# }


def translate_text(text, source_lang, target_lang):
    # Initialize the AWS Translate client
    translate_client = boto3.client("translate", region_name="us-west-1")

    # Translate the text
    response = translate_client.translate_text(
        Text=text, SourceLanguageCode=source_lang, TargetLanguageCode=target_lang
    )

    # Return the translated text
    return response["TranslatedText"]


def update_translations(limit):
    logging.info(f"Start translating titles")

    connection = psycopg2.connect(**DB_PARAMS)
    try:
        # Create a cursor to execute SQL queries
        with connection.cursor() as cursor:
            total_ch = 0
            while total_ch < limit:
                query = """
                    SELECT id, title_en
                    FROM videos
                    WHERE title_en IS NOT NULL AND title_ja IS NULL
                    ORDER BY view_count DESC
                    LIMIT 1000;
                """
                cursor.execute(query)
                rows = cursor.fetchall()

                for video_id, title_en in rows:
                    total_ch += len(title_en)
                    if total_ch >= limit:
                        logging.info(
                            f"Stopped to translate because the total translated charactor will exceed the limit"
                        )
                        done = True
                        break

                    translated_title_ja = translate_text(title_en, "en", "ja")
                    update_query = """
                        UPDATE videos
                        SET title_ja = %s
                        WHERE id = %s;
                    """
                    cursor.execute(update_query, (translated_title_ja, video_id))
                    connection.commit()
                    logging.info(f"Updated translation for video ID {video_id}")

    except Exception as e:
        logging.error(f"Error updating translations: {e}")

    finally:
        # Close the database connection
        connection.close()


def main():
    logging.basicConfig(
        level=logging.INFO,  # Set the desired log level
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler()],  # Log to the console
    )

    # Example usage
    update_translations(200)


if __name__ == "__main__":
    main()
