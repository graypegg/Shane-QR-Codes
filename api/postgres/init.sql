-- DDL generated by Postico 1.4.2
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username varchar UNIQUE,
    password varchar
);

CREATE TABLE colours (
    id SERIAL PRIMARY KEY,
    colour integer,
    user_id integer REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX colours_with_users ON colours(colour int4_ops,user_id int4_ops);