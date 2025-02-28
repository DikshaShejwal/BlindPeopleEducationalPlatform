const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Quiz = require("../models/Quiz"); // ✅ Ensure correct import

// ✅ Upload Quiz Route (For Teachers)
router.post("/upload-quiz", async (req, res) => {
  try {
    const { title, questions, teacherEmail } = req.body;
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0 || !teacherEmail) {
      return res.status(400).json({ message: "❌ Quiz title, questions, and teacher email are required." });
    }

    const quizCode = uuidv4(); // Generate a unique quiz code
    const newQuiz = new Quiz({ title, quizCode, questions, teacherEmail });
    await newQuiz.save();

    console.log("✅ Quiz Uploaded Successfully:", newQuiz);
    res.status(201).json({ message: "✅ Quiz uploaded successfully!", quiz: newQuiz });
  } catch (error) {
    console.error("❌ Error uploading quiz:", error);
    res.status(500).json({ message: "Error uploading quiz" });
  }
});

// ✅ Fetch All Quizzes for Students
router.get("/get-quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "❌ No quizzes found." });
    }

    console.log("📤 Sending quizzes to students:", quizzes);
    res.json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});

module.exports = router; // ✅ Ensure this is at the end!
