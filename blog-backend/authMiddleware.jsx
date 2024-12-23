// authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, "SECRET_KEY", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Anda bukan admin" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateAdmin;
