// db.js
const { Pool } = require("pg");

let pool;

// 1. CHECK FOR CLOUD/AZURE CONFIG FIRST (Uses PG* variables)
if (process.env.PGHOST) {
    console.log("🌐 Using PG* (Azure-style) Configuration.");
    pool = new Pool({
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        // Since you have PGSSLMODE=require, the client needs SSL configuration.
        ssl: {
            rejectUnauthorized: false // This bypasses strict validation often needed in cloud envs
        }
    });
} 
// 2. FALLBACK FOR EXPLICIT LOCAL DEVELOPMENT
else if (process.env.NODE_ENV === "local") {
    console.log("💻 Using Local Development Configuration (NODE_ENV=local).");
    // Ensure you have LOCAL_DB_* variables defined in your local .env file
    pool = new Pool({
        host: process.env.LOCAL_DB_HOST,
        user: process.env.LOCAL_DB_USER,
        port: process.env.LOCAL_DB_PORT,
        database: process.env.LOCAL_DB_NAME,
        password: process.env.LOCAL_DB_PASSWORD
    });
} 
// 3. SAFETY FALLBACK
else {
    console.error("⚠️ FATAL: No database host configuration found (PGHOST missing). Connection will likely fail.");
    // This pool will likely fail, but it prevents the app from crashing before connection attempt
    pool = new Pool(); 
}

module.exports = pool;