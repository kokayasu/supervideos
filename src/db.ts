import { Pool } from "pg";
import { QueryResult } from "pg";

export const NUM_VIDEOS_IN_PAGE = 24;

let conn: Pool | null = null;
if (!conn) {
  const port = process.env.PGSQL_PORT
    ? parseInt(process.env.PGSQL_PORT)
    : undefined;

  conn = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: port,
    database: process.env.PGSQL_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

export async function getVideos(page: number, locale: string): Promise<any[]> {
  const query = `
        SELECT * FROM videos
        WHERE title_${locale} IS NOT NULL
        ORDER BY view_count DESC
        LIMIT $1 OFFSET $2;
    `;
  return (
    await conn!.query(query, [
      NUM_VIDEOS_IN_PAGE,
      (page - 1) * NUM_VIDEOS_IN_PAGE,
    ])
  ).rows;
}

export async function getCategories(locale: string): Promise<any[]> {
  const query = `SELECT id, video_count, name_${locale} as name FROM categories;`;
  return (await conn!.query(query)).rows;
}

export async function getVideoCountAll(locale: string): Promise<number> {
  const query = `
    SELECT count(*) FROM videos
    WHERE title_${locale} IS NOT NULL
  `;
  return (await conn!.query(query, [])).rows[0].count;
}

export async function getVideoCountSearchByWords(
  words: string
): Promise<number> {
  const query = `
        SELECT count(*) FROM videos
        WHERE title_original LIKE $1
    `;
  return (await conn!.query(query, [`%${words}%`])).rows[0].count;
}

export async function getVideoCountSearchByCategory(
  category: string
): Promise<number> {
  const query = `
        SELECT video_count FROM categories
        WHERE id = $1
    `;
  const result = await conn!.query(query, [category]);
  return result.rows[0].video_count;
}

export async function searchVideosByWords(
  words: string,
  page: number
): Promise<any[]> {
  const query = `
        SELECT * FROM videos
        WHERE title_original LIKE $1
        LIMIT $2 OFFSET $3;
    `;
  return (
    await conn!.query(query, [
      `%${words}%`,
      NUM_VIDEOS_IN_PAGE,
      (page - 1) * NUM_VIDEOS_IN_PAGE,
    ])
  ).rows;
}

export async function searchVideosByCategory(
  locale: string,
  category: string,
  page: number
): Promise<any[]> {
  const query = `
        SELECT * FROM videos
        WHERE
          categories @> ARRAY[$1]::character varying[]
        AND
          title_${locale} IS NOT NULL
        ORDER BY view_count DESC
        LIMIT $2 OFFSET $3;
    `;
  return (
    await conn!.query(query, [
      category,
      NUM_VIDEOS_IN_PAGE,
      (page - 1) * NUM_VIDEOS_IN_PAGE,
    ])
  ).rows;
}

export async function searchVideoById(id: string): Promise<any> {
  const query = "SELECT * from videos where id = $1";
  return (await conn!.query(query, [id])).rows[0];
}

export async function getTopCategories(): Promise<QueryResult> {
  const query = `
        SELECT * FROM categories LIMIT 15;
    `;
  return await conn!.query(query);
}
