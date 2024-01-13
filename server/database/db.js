//require Pool function from pg-pool module
const { Pool } = require('pg');
//require and configure dotenv to access environment variables
require('dotenv').config();

// Configure your database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_full_stack',
  password: process.env.DB_PASSWORD,
  port: 5433 // Change this to your database's port (usually 5432)
});

module.exports = pool;
