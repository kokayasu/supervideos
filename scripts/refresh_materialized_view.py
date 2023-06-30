#!/usr/bin/env python3
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import logging

logging.basicConfig(
    level=logging.INFO,  # Set the desired log level
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()],  # Log to the console
)

db_params = {
    "host": "database-1.c7pdgnl5hc90.us-west-1.rds.amazonaws.com",
    "port": "5432",
    "database": "videopurple",
    "user": "postgres",
    "password": "5ZacDYV4eBaXflrQfNJU",
}
# db_params = {
#     "host": "localhost",
#     "port": "5432",
#     "database": "videopurple",
#     "user": "postgres",
#     "password": "postgres",
# }


def refresh_materialized_views():
    logging.info(f"Refresh Materialized Views")
    try:
        conn = psycopg2.connect(**db_params)
        with open("./src/categoryTranslations.json", "r") as file:
            categories = json.load(file)

        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            for category in categories:
                formatted_category = category.replace("-", "_")
                sql_template = """
                    REFRESH MATERIALIZED VIEW mv_{formatted_category}_en
                """
                sql_statement = sql_template.format(
                    formatted_category=formatted_category
                )
                cursor.execute(sql_statement)
                conn.commit()
                logging.info(
                    f"Refreshed Materialized view for {category} en successfully."
                )

            for category in categories:
                formatted_category = category.replace("-", "_")
                sql_template = """
                    REFRESH MATERIALIZED VIEW mv_{formatted_category}_ja
                """
                sql_statement = sql_template.format(
                    formatted_category=formatted_category
                )
                cursor.execute(sql_statement)
                conn.commit()
                logging.info(
                    f"Refreshed Materialized view for {category} ja successfully."
                )

    except psycopg2.Error as e:
        print(f"Error refreshing materialized view for {category}: {e}")
    finally:
        conn.close()


def main():
    refresh_materialized_views()


if __name__ == "__main__":
    main()
