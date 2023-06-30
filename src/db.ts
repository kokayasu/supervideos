import { Pool } from "pg";
import { QueryResult } from "pg";

export const NUM_VIDEOS_IN_PAGE = 21

let conn: Pool | null = null;
if (!conn) {
  console.log("PGSQL_HOST: " + process.env.PGSQL_HOST);
  console.log("PGSQL_PORT: " + process.env.PGSQL_PORT);
  console.log("PGSQL_DATABASE: " + process.env.PGSQL_DATABASE);
  console.log("PGSQL_USER: " + process.env.PGSQL_USER);
  console.log("PGSQL_PASSWORD: " + process.env.PGSQL_PASSWORD);
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

export async function getVideos(): Promise<any[]> {
  const query = `SELECT * FROM videos ORDER BY view_count DESC LIMIT $1;`;
  return (await conn!.query(query, [NUM_VIDEOS_IN_PAGE])).rows;
}

export async function getCategories(locale: string): Promise<any[]> {
  const query = `SELECT id, video_count, name_${locale} as name FROM categories;`;
  return (await conn!.query(query)).rows;
}

export async function getVideoCountSearchByWords(words: string): Promise<number> {
  const query = `
        SELECT count(*) FROM videos
        WHERE title_en LIKE $1
    `;
  return (await conn!.query(query, [`%${words}%`])).rows[0].count;
}

export async function getVideoCountSearchByCategory(category: string): Promise<number> {
  const query = `
        SELECT video_count FROM categories
        WHERE id = $1
    `;
  const result = await conn!.query(query, [category]);
  return result.rows[0].video_count;
}

export async function searchVideosByWords(words: string, locale: string): Promise<any[]> {
  const query = `
        SELECT * FROM videos
        WHERE title_${locale} LIKE $1
        limit $2;
    `;
  return (await conn!.query(query, [`%${words}%`, NUM_VIDEOS_IN_PAGE])).rows;
}

export async function searchVideosByCategory(
  category: string,
  page: number
): Promise<any[]> {
  console.log("Search Videos By " + category);
  const query = `
        SELECT * FROM videos
        WHERE categories @> ARRAY[$1]::character varying[]
        LIMIT $2 OFFSET $3;
    `;
  return (await conn!.query(query, [category, NUM_VIDEOS_IN_PAGE, (page - 1) * NUM_VIDEOS_IN_PAGE])).rows;
}

export async function searchVideoById(id: string): Promise<any> {
  const query = "SELECT * from videos where id = $1";
  return (await conn!.query(query, [id])).rows[0];
}

export async function getTopCategories(): Promise<QueryResult> {
  const query = `
        SELECT * FROM categories LIMIT 20;
    `;
  return await conn!.query(query);
}
