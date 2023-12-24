#!/usr/bin/env python3
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from logging_config import configure_logging
import logging
from utils import DB_PARAMS


def refresh_materialized_view(cursor, category, locale):
    formatted_category = category.replace("-", "_")
    sql_template = "REFRESH MATERIALIZED VIEW mv_{formatted_category}_{locale}"
    sql_statement = sql_template.format(
        formatted_category=formatted_category, locale=locale
    )
    cursor.execute(sql_statement)
    logging.info(f"Refreshed Materialized view for {category} {locale} successfully.")


def refresh_materialized_views():
    logging.info("Refresh Materialized Views")

    try:
        conn = psycopg2.connect(**DB_PARAMS)

        with open("./src/categoryTranslations.json", "r") as file:
            categories = json.load(file)

        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            for category in categories:
                refresh_materialized_view(cursor, category, "en")
                refresh_materialized_view(cursor, category, "ja")

        conn.commit()

    except psycopg2.Error as e:
        logging.error(f"Error refreshing materialized views: {e}")

    finally:
        conn.close()


if __name__ == "__main__":
    configure_logging()
    refresh_materialized_views()
