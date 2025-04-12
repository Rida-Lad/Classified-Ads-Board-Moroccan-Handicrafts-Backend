const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this at the top
const mysql = require('mysql2');
const app = express();

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'adsmor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Generate 6-digit access code
function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Add this before the POST endpoint in server.js
app.get('/api/ads', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM ads ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST endpoint
app.post('/api/ads', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, phone_number } = req.body;
    const accessCode = generateAccessCode();
    const imagePath = req.file.filename; // ← This is the critical change

    await pool.promise().execute(
      'INSERT INTO ads (access_code, title, description, price, category, image_path, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [accessCode, title, description, price, category, imagePath, phone_number]
    );

    res.status(201).json({ accessCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get ad by access code
app.get('/api/ads/:accessCode', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM ads WHERE access_code = ?',
      [req.params.accessCode]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/admin/stats', async (req, res) => {
  try {
    // Total ads
    const [totalResult] = await pool.promise().query('SELECT COUNT(*) as total FROM ads');
    
    // Ads per category
    const [categoryResult] = await pool.promise().query(
      'SELECT category, COUNT(*) as count FROM ads GROUP BY category'
    );
    
    // Latest ads
    const [latestResult] = await pool.promise().query(
      'SELECT title, created_at FROM ads ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      total: totalResult[0].total,
      byCategory: categoryResult,
      latest: latestResult
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update ad
app.put('/api/ads/:accessCode', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, phone_number } = req.body;
    const accessCode = req.params.accessCode;

    let imagePath = req.body.existingImage; // Keep existing image if not changed
    
    if (req.file) {
      imagePath = req.file.filename;
      // Delete old image file (optional)
      fs.unlinkSync(path.join(uploadDir, req.body.existingImage));
    }

    const [result] = await pool.promise().execute(
      `UPDATE ads SET 
       title = ?, 
       description = ?, 
       price = ?, 
       category = ?, 
       phone_number = ?,
       image_path = ?
       WHERE access_code = ?`,
      [title, description, price, category, phone_number, imagePath, accessCode]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    res.json({ message: 'Ad updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete ad
app.delete('/api/ads/:accessCode', async (req, res) => {
  try {
    // First get the ad to delete the image file
    const [rows] = await pool.promise().query(
      'SELECT image_path FROM ads WHERE access_code = ?',
      [req.params.accessCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Delete from database
    await pool.promise().execute(
      'DELETE FROM ads WHERE access_code = ?',
      [req.params.accessCode]
    );

    // Delete image file (optional)
    fs.unlinkSync(path.join(uploadDir, rows[0].image_path));

    res.json({ message: 'Ad deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));