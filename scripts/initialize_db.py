#!/usr/bin/env python3
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import logging
from utils import configure_logging, DB_PARAMS
import concurrent.futures
from create_indexes import create_indexes
from create_materialized_views import create_materialized_views
from move_translations import move_translations
from populate_categories_table import populate_categories_table
from populate_pagination_tables import populate_pagination_tables
import pornhub.populate_videos_table_from_source
import xvideos.populate_videos_table_from_source

SQL_FILE_PATH = "./scripts/setup_db.sql"


def create_tables():
    conn = None
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            with open(SQL_FILE_PATH, "r") as file:
                sql_script = file.read()
            cursor.execute(sql.SQL(sql_script))
            conn.commit()
            logging.info("SQL script executed successfully.")

    except Exception as e:
        logging.error(f"Error executing SQL script: {str(e)}")
        raise e
    finally:
        if conn is not None:
            conn.close()


def populate_videos_table():
    with concurrent.futures.ProcessPoolExecutor(max_workers=2) as executor:
        futures = [
            executor.submit(pornhub.populate_videos_table_from_source.run),
            executor.submit(xvideos.populate_videos_table_from_source.run),
        ]
        concurrent.futures.wait(futures)

        for future in concurrent.futures.as_completed(futures):
            try:
                future.result()
            except Exception as e:
                logging.error(f"Exception occurred: {e}")
                raise e


if __name__ == "__main__":
    configure_logging()
    # create_tables()
    # populate_videos_table()
    # move_translations()
    # create_indexes()
    # create_materialized_views()
    populate_categories_table()
    # populate_pagination_tables()
