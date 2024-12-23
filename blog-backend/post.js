// backend/routes/posts.js
const express = require("express");
const router = express.Router();

// Hapus post berdasarkan ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  // Misalnya, kita menggunakan MongoDB atau database lain untuk menghapus post berdasarkan ID
  // db.collection('posts').deleteOne({ _id: id });

  res.status(200).send({ message: "Post berhasil dihapus" });
});

module.exports = router;
