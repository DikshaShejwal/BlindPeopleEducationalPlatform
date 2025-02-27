const express = require("express");
const multer = require("multer");
const Question = require("../models/Question");

const router = express.Router();

// ✅ Multer Storage for Audio Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 📩 Student asks a question (Text + Audio)
router.post("/ask-question", upload.single("audio"), async (req, res) => {
  try {
    const { studentEmail, question } = req.body;
    const audio = req.file ? req.file.buffer.toString("base64") : null; // Convert audio to Base64

    if (!studentEmail || (!question && !audio)) {
      return res.status(400).json({ message: "Text or audio question is required" });
    }

    const newQuestion = new Question({ studentEmail, question, audio, answer: "", answerAudio: "" });
    await newQuestion.save();

    res.status(201).json({ message: "Question submitted successfully!" });
  } catch (error) {
    console.error("Error submitting question:", error);
    res.status(500).json({ message: "Error submitting question" });
  }
});

// 📋 Teacher fetches unanswered questions (Text + Audio)
router.get("/get-questions", async (req, res) => {
  try {
    const questions = await Question.find({ answer: "" }, { answer: 0, answerAudio: 0 }); // Hide answers
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// 📝 Teacher answers a question (Text + Audio)
router.post("/answer-question", upload.single("audio"), async (req, res) => {
  try {
    const { questionId, answer, teacherEmail } = req.body;
    const answerAudio = req.file ? req.file.buffer.toString("base64") : null;

    if (!questionId || (!answer && !answerAudio) || !teacherEmail) {
      return res.status(400).json({ message: "Text or audio answer is required" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { answer, answerAudio, teacherEmail },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Answer submitted successfully!" });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Error submitting answer" });
  }
});

// 🎓 Student fetches their answered questions (Text + Audio)
router.get("/get-answers", async (req, res) => {
  try {
    const { studentEmail } = req.query;

    if (!studentEmail) {
      return res.status(400).json({ message: "Student email is required" });
    }

    const answers = await Question.find({ studentEmail, answer: { $ne: "" } });
    res.json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ message: "Error fetching answers" });
  }
});

module.exports = router;
