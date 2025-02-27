const express = require("express");
const multer = require("multer");
const path = require("path");
const Answer = require("../models/Answer");

const router = express.Router();

// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, "../uploads");
const fs = require("fs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Teacher uploads answer with audio
router.post("/upload-answer", upload.single("audioFile"), async (req, res) => {
  try {
    const { question, answer, studentEmail } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const newAnswer = new Answer({
      question,
      answer,
      studentEmail,
      audioPath: req.file.path // Store the file path
    });

    await newAnswer.save();
    res.status(201).json({ message: "Answer uploaded successfully", newAnswer });
  } catch (error) {
    console.error("Error uploading answer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
