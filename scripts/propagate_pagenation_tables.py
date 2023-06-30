#!/usr/bin/env python3
import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)  # Set the desired log level

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


def populate_pagination_info(conn, locale):
    logging.info(f"Start populating pagination info for {locale}")
    with conn.cursor() as cursor:
        try:
            # Clear existing data
            cursor.execute(f"DELETE FROM pagination_info_sitemap_{locale}")

            page = 1
            page_size = 1000
            last_id = "0"

            while True:
                sql = f"""
                    SELECT id
                    FROM videos
                    WHERE id > '{last_id}'
                        AND title_{locale} IS NOT NULL
                    ORDER BY id
                    LIMIT {page_size}
                """
                cursor.execute(sql)
                result_rows = cursor.fetchall()
                if not result_rows:
                    break

                cursor.execute(
                    f"""
                    INSERT INTO pagination_info_sitemap_{locale} (page_number, id)
                    VALUES (%s, %s)
                """,
                    (page, last_id),
                )
                logging.info(f"Inserted page {page}, last_id {last_id}")

                last_row = result_rows[-1]
                last_id = last_row[0]
                page += 1

            logging.info(f"Successfully populated pagination info for {locale}")

        except Exception as e:
            logging.error(f"Error populating pagination info: {str(e)}")

    conn.commit()


def main():
    try:
        connection = psycopg2.connect(**db_params)
        populate_pagination_info(connection, "en")
        populate_pagination_info(connection, "ja")

    except psycopg2.Error as e:
        print(f"Error: {e}")
    finally:
        if connection:
            connection.close()


if __name__ == "__main__":
    main()
