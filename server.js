// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
// *** IMPORTANT FIX: Removed const { Pool } = require("pg"); ***
const pool = require('./db'); // <-- IMPORTS THE CONFIGURED DATABASE POOL FROM db.js
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📝 Enquiry route
app.post(['/api/enquiry', '/api/enquiry_form'], async (req, res) => {
  const { full_name, phone, email, batch_timings, course, education, passed_out_year } = req.body;

  try {
    // Ensure data validation happens here before querying the DB!
    
    const result = await pool.query(
      `INSERT INTO enquiry_form (full_name, phone, email, batch_timings, course, education, passed_out_year)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [full_name, phone, email, batch_timings, course, education, passed_out_year]
    );

    res.status(200).json({ message: 'Enquiry submitted successfully', id: result.rows[0].id });
  } catch (err) {
    // Logs the specific database error to your Render console
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
