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
db_params = {
    "host": "localhost",
    "port": "5432",
    "database": "videopurple",
    "user": "postgres",
    "password": "postgres",
}


def create_indexes():
    logging.info(f"Create Indexes")
    try:
        conn = psycopg2.connect(**db_params)
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Build and execute the SQL query
            index_queries = [
                "CREATE INDEX idx_title_orig ON videos USING gin (title_orig gin_bigm_ops);",
                "CREATE INDEX idx_view_nonnull_en ON videos (view_count) WHERE title_en IS NOT NULL;",
                "CREATE INDEX idx_view_nonnull_ja ON videos (view_count) WHERE title_ja IS NOT NULL;",
                "CREATE INDEX idx_categories_en ON videos using gin(categories) WHERE title_en IS NOT NULL;",
                "CREATE INDEX idx_categories_ja ON videos using gin(categories) WHERE title_ja IS NOT NULL;",
            ]

            for query in index_queries:
                logging.info(f"Execute '{query}")
                cursor.execute(query)
                conn.commit()

    finally:
        conn.close()


def create_materialized_views():
    logging.info(f"Create Materialized Views")
    try:
        conn = psycopg2.connect(**db_params)
        with open("./src/categoryTranslations.json", "r") as file:
            categories = json.load(file)

        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            for category in categories:
                formatted_category = category.replace("-", "_")
                sql_template = """
                    CREATE MATERIALIZED VIEW mv_{formatted_category}_en AS
                    SELECT *
                    FROM videos
                    WHERE categories @> ARRAY['{category}']::character varying[]
                    AND title_en IS NOT NULL
                    ORDER BY view_count DESC;
                """
                sql_statement = sql_template.format(
                    formatted_category=formatted_category, category=category
                )
                cursor.execute(sql_statement)
                conn.commit()
                logging.info(
                    f"Materialized view for {category} en created successfully."
                )

            for category in categories:
                formatted_category = category.replace("-", "_")
                sql_template = """
                    DO $$
                    BEGIN
                        IF NOT EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_{formatted_category}_ja') THEN
                            CREATE MATERIALIZED VIEW mv_{formatted_category}_ja AS
                            SELECT *
                            FROM videos
                            WHERE categories @> ARRAY['{category}']::character varying[]
                            AND title_ja IS NOT NULL
                            ORDER BY view_count DESC;
                            RAISE INFO 'Materialized view for {category} ja created successfully.';
                        ELSE
                            RAISE INFO 'Materialized view for {category} ja already exists.';
                        END IF;
                    END $$;
                """
                sql_statement = sql_template.format(
                    formatted_category=formatted_category, category=category
                )
                cursor.execute(sql_statement)
                conn.commit()
                logging.info(
                    f"Materialized view for {category} ja created successfully."
                )

    except psycopg2.Error as e:
        print(f"Error creating materialized view for {category}: {e}")
    finally:
        conn.close()


def main():
    create_indexes()
    create_materialized_views()


if __name__ == "__main__":
    main()
