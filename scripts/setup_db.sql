-- Create the database
CREATE EXTENSION IF NOT EXISTS pg_bigm;

CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(22) PRIMARY KEY,
    source_id VARCHAR(2),
    thumbnail VARCHAR(150),
    view_count INT,
    like_count INT,
    dislike_count INT,
    created_at DATE,
    duration INT,
    resolution VARCHAR(7),
    categories VARCHAR(50)[] NOT NULL,
    title_orig_locale VARCHAR(2),
    title_orig TEXT,
    title_en TEXT,
    title_ja TEXT
);

CREATE TABLE IF NOT EXISTS pagination_info_sitemap_en (
    page_number SERIAL PRIMARY KEY,
    id VARCHAR(22)
);

CREATE TABLE IF NOT EXISTS pagination_info_sitemap_ja (
    page_number SERIAL PRIMARY KEY,
    id VARCHAR(22)
);

CREATE TABLE IF NOT EXISTS categories (
    category VARCHAR(50),
    locale VARCHAR(2),
    count INT NOT NULL,
    PRIMARY KEY (category, locale)
);
