// ===============================
// 📦 Imports & Config
// ===============================
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config(); // loads .env locally

const app = express();
const port = process.env.PORT || 3000;

// ===============================
// 🧠 Database Configuration
// ===============================
let poolConfig;

// Render automatically provides the env variable RENDER=true
// So we’ll use that to detect production (Azure DB)
if (process.env.RENDER) {
  poolConfig = {
    user: process.env.AZURE_DB_USER,
    host: process.env.AZURE_DB_HOST,
    database: process.env.AZURE_DB_NAME,
    password: process.env.AZURE_DB_PASSWORD,
    port: process.env.AZURE_DB_PORT,
    ssl: { rejectUnauthorized: false } // required for Azure
  };
  console.log('🌐 Using Azure PostgreSQL Database on Render');
} else {
  // local development (localhost)
  poolConfig = {
    user: process.env.LOCAL_DB_USER,
    host: process.env.LOCAL_DB_HOST,
    database: process.env.LOCAL_DB_NAME,
    password: process.env.LOCAL_DB_PASSWORD,
    port: process.env.LOCAL_DB_PORT
  };
  console.log('💻 Using Local PostgreSQL Database');
}

const pool = new Pool(poolConfig);

// ===============================
// ⚙️ Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// 📝 API Route: Enquiry Form
// ===============================
app.post(['/api/enquiry', '/api/enquiry_form'], async (req, res) => {
  const { full_name, phone, email, batch_timings, course, education, passed_out_year } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO enquiry_form (full_name, phone, email, batch_timings, course, education, passed_out_year)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [full_name, phone, email, batch_timings, course, education, passed_out_year]
    );

    res.status(200).json({ message: 'Enquiry submitted successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Error inserting enquiry:', err);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// ===============================
// 🧪 Test Route for DB Connection
// ===============================
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB Connection Test Failed:', err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// ===============================
// 🏠 Root Route
// ===============================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'enquiryform.html'));
});

// ===============================
// 🚀 Start Server
// ===============================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
