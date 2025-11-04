const { Pool } = require("pg");

let pool;

if (process.env.NODE_ENV === "local") {
  // Local PostgreSQL
  pool = new Pool({
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    port: process.env.LOCAL_DB_PORT,
    database: process.env.LOCAL_DB_NAME,
    password: process.env.LOCAL_DB_PASSWORD
  });
} else {
  // Azure PostgreSQL
  pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl: {
      rejectUnauthorized: false // required for Azure PostgreSQL
    }
  });
}

module.exports = pool;
