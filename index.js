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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));