-- Create the database
CREATE DATABASE videopurple;

\c videopurple;

CREATE EXTENSION pg_bigm;

CREATE TABLE videos (
    id VARCHAR(22) PRIMARY KEY,
    source_id VARCHAR(2),
    thumbnail VARCHAR(150),
    view_count INT,
    like_count INT,
    dislike_count INT,
    created_at DATE,
    duration INTERVAL,
    resolution VARCHAR(7),
    categories VARCHAR(50)[] NOT NULL,
    title_orig_locale VARCHAR(2),
    title_orig text,
    title_en text,
    title_ja text
);

CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    video_count INT NOT NULL,
    name_en VARCHAR(50),
    name_ja VARCHAR(50)
);
