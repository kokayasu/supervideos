-- Create the database
CREATE DATABASE supervideos;

\c supervideos;

CREATE EXTENSION pg_bigm;

CREATE TABLE videos (
    id VARCHAR(20) PRIMARY KEY,
    thumbnail VARCHAR(150),
    view_count INT,
    like_count INT,
    dislike_count INT,
    created_at DATE,
    duration INTERVAL,
    resolution VARCHAR(7),
    categories VARCHAR(50)[] NOT NULL,
    title_original text,
    title_en text,
    title_ja text
);

CREATE INDEX idx_videos ON videos USING hash (id);
CREATE INDEX idx_categories ON videos USING GIN(categories);
CREATE INDEX idx_view_counts ON videos (view_count);
CREATE INDEX title_en_idx ON videos USING gin (title_en gin_bigm_ops);
CREATE INDEX title_ja_idx ON videos USING gin (title_ja gin_bigm_ops);

CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    video_count INT NOT NULL,
    name_en VARCHAR(50),
    name_ja VARCHAR(50)
);
