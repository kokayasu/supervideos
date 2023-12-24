#!/usr/bin/env python3
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from utils import configure_logging, DB_PARAMS, CATEGORY_TRANSLATION_JSON_PATH

configure_logging()


def populate_categories_table():
    logging.info("Start populating categories table")

    try:
        conn = psycopg2.connect(**DB_PARAMS)
        with open(CATEGORY_TRANSLATION_JSON_PATH, "r") as file:
            categories = json.load(file)

        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("DELETE FROM categories")

            for locale in ["ja", "en"]:
                for category in categories:
                    formatted_category = category.replace("-", "_")
                    sql_template = """
                        SELECT COUNT(id) FROM mv_{formatted_category}_{locale};
                    """
                    sql_statement = sql_template.format(
                        formatted_category=formatted_category,
                        locale=locale,
                    )
                    cursor.execute(sql_statement)
                    result_rows = cursor.fetchall()
                    cursor.execute(
                        "INSERT INTO categories (category, locale, count) VALUES (%s, %s, %s)",
                        (category, locale, result_rows[0]["count"]),
                    )
                    logging.info(
                        f"Inserted categories table data for {category} {locale}"
                    )
            conn.commit()
            logging.info("Successfully populated categories table")

    except Exception as e:
        logging.error(f"Error populating categories table: {str(e)}")
        raise e


if __name__ == "__main__":
    populate_categories_table()
