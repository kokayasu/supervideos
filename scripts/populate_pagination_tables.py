#!/usr/bin/env python3
import psycopg2
import logging
from utils import DB_PARAMS, configure_logging


def clear_existing_data(cursor, table_name):
    cursor.execute(f"DELETE FROM {table_name}")


def insert_pagination_info(cursor, table_name, page, last_id):
    cursor.execute(
        f"""
        INSERT INTO {table_name} (page_number, id)
        VALUES (%s, %s)
        """,
        (page, last_id),
    )
    logging.info(f"Inserted page {page}, last_id {last_id}")


def populate_pagination_tables(page_size=1000):
    try:
        with psycopg2.connect(**DB_PARAMS) as conn:
            with conn.cursor() as cursor:
                for locale in ["ja", "en"]:
                    logging.info(f"Start populating pagination info for {locale}")
                    clear_existing_data(cursor, f"pagination_info_sitemap_{locale}")

                    page = 1
                    last_id = "0"

                    while True:
                        sql = f"""
                            SELECT id
                            FROM videos
                            WHERE id > %s AND title_{locale} IS NOT NULL
                            ORDER BY id
                            LIMIT %s
                        """
                        cursor.execute(sql, (last_id, page_size))
                        result_rows = cursor.fetchall()

                        if not result_rows:
                            break

                        insert_pagination_info(
                            cursor, f"pagination_info_sitemap_{locale}", page, last_id
                        )

                        last_row = result_rows[-1]
                        last_id = last_row[0]
                        page += 1

                    logging.info(f"Successfully populated pagination info for {locale}")
    except Exception as e:
        logging.error(f"Error populating pagination info: {str(e)}")


if __name__ == "__main__":
    configure_logging()
    populate_pagination_tables()
