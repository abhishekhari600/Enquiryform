const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require("pg");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Choose DB config based on NODE_ENV
let poolConfig;

if (process.env.NODE_ENV === "azure") {
  poolConfig = {
    user: process.env.AZURE_DB_USER,
    host: process.env.AZURE_DB_HOST,
    database: process.env.AZURE_DB_NAME,
    password: process.env.AZURE_DB_PASSWORD,
    port: process.env.AZURE_DB_PORT,
    ssl: { rejectUnauthorized: false } // required for Azure PostgreSQL
  };
  console.log("🌐 Using Azure PostgreSQL Database");
} else {
  poolConfig = {
    user: process.env.LOCAL_DB_USER,
    host: process.env.LOCAL_DB_HOST,
    database: process.env.LOCAL_DB_NAME,
    password: process.env.LOCAL_DB_PASSWORD,
    port: process.env.LOCAL_DB_PORT
  };
  console.log("💻 Using Local PostgreSQL Database");
}

const pool = new Pool(poolConfig);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📝 Enquiry route
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

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'enquiryform.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
