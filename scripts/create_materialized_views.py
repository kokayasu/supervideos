#!/usr/bin/env python3
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from utils import configure_logging, DB_PARAMS

configure_logging()


def create_materialized_views():
    logging.info("Start creating Materialized Views")
    try:
        with open("./src/categoryTranslations.json", "r") as file:
            categories = json.load(file)

        conn = psycopg2.connect(**DB_PARAMS)
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            for locale in ["ja", "en"]:
                for category in categories:
                    formatted_category = category.replace("-", "_")
                    sql_statement = f"""
                        CREATE MATERIALIZED VIEW mv_{formatted_category}_{locale} AS
                        SELECT *
                        FROM videos
                        WHERE categories @> ARRAY['{category}']::character varying[]
                        AND title_{locale} IS NOT NULL
                        ORDER BY view_count DESC;
                    """
                    cursor.execute(sql_statement)
                    conn.commit()
                    logging.info(
                        f"Materialized view for {category} {locale} created successfully."
                    )
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise e


if __name__ == "__main__":
    create_materialized_views()
