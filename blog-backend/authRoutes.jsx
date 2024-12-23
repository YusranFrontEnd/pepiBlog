// authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Pastikan Anda sudah memiliki model User

const router = express.Router();

// Endpoint login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Cari user di database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Pengguna tidak ditemukan" });
  }

  // Verifikasi password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password salah" });
  }

  // Buat token JWT
  const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY", {
    expiresIn: "1h",
  });

  res.json({ token });
});

module.exports = router;
