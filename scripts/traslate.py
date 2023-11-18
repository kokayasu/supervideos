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
    # Establish a connection to the PostgreSQL database
    connection = psycopg2.connect(**DB_PARAMS)

    try:
        # Create a cursor to execute SQL queries
        with connection.cursor() as cursor:
            # Execute the SQL query to retrieve rows that need translation
            query = """
                SELECT id, title_en
                FROM videos
                WHERE title_en IS NOT NULL AND title_ja IS NULL
                ORDER BY view_count DESC
                LIMIT %s;
            """
            cursor.execute(query, (limit,))

            # Fetch all rows
            rows = cursor.fetchall()

            logging.info(f"Translating titles for {len(rows)} videos.")

            # Update each row with the translated title
            for video_id, title_en in rows:
                translated_title_ja = translate_text(title_en, "en", "ja")

                # Update the row in the database
                update_query = """
                    UPDATE videos
                    SET title_ja = %s
                    WHERE id = %s;
                """
                cursor.execute(update_query, (translated_title_ja, video_id))

                logging.info(f"Updated translation for video ID {video_id}")

        # Commit the changes to the database
        connection.commit()

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
    update_translations(1)


if __name__ == "__main__":
    main()
