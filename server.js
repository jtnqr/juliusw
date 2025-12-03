const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
// This allows index.html and compiled TS files to be served directly
app.use(express.static(path.join(__dirname)));

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kampus_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Database Connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Terhubung ke Database MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Gagal terhubung ke Database:', err.message);
  });

// API Routes

// GET: Ambil semua mahasiswa
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mahasiswa ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Tambah mahasiswa
app.post('/api/students', async (req, res) => {
  const { nama, jurusan, npm } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO mahasiswa (nama, jurusan, npm) VALUES (?, ?, ?)',
      [nama, jurusan, npm]
    );
    res.status(201).json({ id: result.insertId, nama, jurusan, npm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update mahasiswa
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, jurusan, npm } = req.body;
  try {
    await pool.query(
      'UPDATE mahasiswa SET nama = ?, jurusan = ?, npm = ? WHERE id = ?',
      [nama, jurusan, npm, id]
    );
    res.json({ id, nama, jurusan, npm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Hapus mahasiswa
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mahasiswa WHERE id = ?', [id]);
    res.json({ message: 'Mahasiswa berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fallback for SPA (Single Page Application) - optional for this setup
// but good practice if using client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});