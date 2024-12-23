const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Mengambil JSON data dalam body request
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Folder statis untuk mengakses file yang diunggah

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder tujuan upload
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Format nama file yang unik
  },
});
const upload = multer({ storage: storage });

// Koneksi MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "LuckyCode", // Ganti dengan password yang sesuai
  database: "blog", // Ganti dengan nama database Anda
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    process.exit(1); // Jika gagal terkoneksi, hentikan server
  }
  console.log("Connected to MySQL database");
});

// API Routes

// Get all posts
app.get("/api/posts", (req, res) => {
  const query = "SELECT * FROM posts";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err.message);
      return res
        .status(500)
        .json({ error: "Error fetching posts from the database" });
    }
    res.json(results);
  });
});

// Add a new post (with image)
app.post("/api/posts", upload.single("image"), (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`; // Path file gambar yang diupload
  }

  const query = "INSERT INTO posts (title, content, image) VALUES (?, ?, ?)";
  db.query(query, [title, content, imagePath], (err, results) => {
    if (err) {
      console.error("Error adding post:", err.message);
      return res
        .status(500)
        .json({ error: "Error adding post to the database" });
    }

    // Kirimkan response dengan data post yang baru ditambahkan
    res.status(201).json({
      id: results.insertId,
      title,
      content,
      image: imagePath,
      created_at: new Date(),
    });
  });
});

// Upload file (image)
app.post("/api/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File not uploaded" });
  }

  res.status(201).json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Delete a post by ID
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;

  const checkQuery = "SELECT * FROM posts WHERE id = ?";
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error("Error checking post existence:", err.message);
      return res.status(500).json({ error: "Error checking post existence" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const deleteQuery = "DELETE FROM posts WHERE id = ?";
    db.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error("Error deleting post:", err.message);
        return res
          .status(500)
          .json({ error: "Error deleting post from the database" });
      }

      res
        .status(200)
        .json({ message: `Post with ID ${id} deleted successfully` });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
