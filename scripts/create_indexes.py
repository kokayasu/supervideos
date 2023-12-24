#!/usr/bin/env python3
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from utils import configure_logging, DB_PARAMS


def create_indexes():
    logging.info("Create Indexes")
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Build and execute the SQL query
            index_queries = [
                # This should help order results by view_count
                "CREATE INDEX idx_view_nonnull_en ON videos (view_count) WHERE title_en IS NOT NULL;",
                "CREATE INDEX idx_view_nonnull_ja ON videos (view_count) WHERE title_ja IS NOT NULL;",
                # This should help category search
                "CREATE INDEX idx_categories_en ON videos using gin(categories) WHERE title_en IS NOT NULL;",
                "CREATE INDEX idx_categories_ja ON videos using gin(categories) WHERE title_ja IS NOT NULL;",
                # This is for word search.
                "CREATE INDEX idx_title_orig ON videos USING gin (title_orig gin_bigm_ops);",
            ]

            for query in index_queries:
                logging.info(f"Execute '{query}")
                cursor.execute(query)
                conn.commit()

    finally:
        conn.close()


if __name__ == "__main__":
    configure_logging()
    create_indexes()
