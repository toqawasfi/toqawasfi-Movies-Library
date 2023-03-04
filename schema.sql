DROP TABLE IF EXISTS favmovies;
CREATE TABLE IF NOT EXISTS favmovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    summary VARCHAR
);