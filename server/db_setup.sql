CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL
);

INSERT INTO todos (task) VALUES
  ('walk the dog'),
  ('do the dishes'),
  ('clean my room');

INSERT INTO users (username, password) VALUES
  ('user1', 'password1'),
  ('user2', 'password2');