#!/usr/bin/env python3
import json
import psycopg2
from psycopg2.extras import RealDictCursor

# Load categories from JSON file
with open("./src/categoryTranslations.json", "r") as file:
    categories = json.load(file)

# PostgreSQL connection parameters
db_params = {
    "host": "database-1.c7pdgnl5hc90.us-west-1.rds.amazonaws.com",
    "port": "5432",
    "database": "supervideos",
    "user": "postgres",
    "password": "5ZacDYV4eBaXflrQfNJU",
}

# Connect to the database
conn = psycopg2.connect(**db_params)

try:
    with conn.cursor(cursor_factory=RealDictCursor) as cursor:
        for category in categories:
            # Build and execute the SQL query for each category
            sql_query = """
                EXPLAIN ANALYZE SELECT * FROM videos
                WHERE categories @> ARRAY [%s]::character varying[]
                    AND title_en IS NOT NULL
                ORDER BY view_count DESC
                LIMIT 30 OFFSET 0;
            """
            print(f"Category: {category}", flush=True)
            cursor.execute(sql_query, (category,))
            rows = cursor.fetchall()
            for row in rows:
                print(row["QUERY PLAN"], flush=True)
            print("=" * 50)

finally:
    # Close the database connection
    conn.close()
