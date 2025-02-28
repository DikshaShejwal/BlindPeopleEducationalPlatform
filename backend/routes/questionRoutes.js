const express = require("express");
const multer = require("multer");
const Question = require("../models/Question");
const Answer = require("../models/Answer"); // Import Answer model

const router = express.Router();

// ✅ Multer Storage for Audio Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/** 📩 Student asks a question (Text + Audio) */
router.post("/ask-question", upload.single("audio"), async (req, res) => {
  try {
    const { studentEmail, question } = req.body;
    const audio = req.file ? req.file.buffer.toString("base64") : null; // Convert audio to Base64

    if (!studentEmail || (!question && !audio)) {
      return res.status(400).json({ message: "Text or audio question is required" });
    }

    const newQuestion = new Question({
      studentEmail,
      question,
      audio,
      answer: "",
      answerAudio: "",
    });

    await newQuestion.save();
    console.log("✅ New Question Saved:", newQuestion);

    res.status(201).json({ message: "Question submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting question:", error);
    res.status(500).json({ message: "Error submitting question" });
  }
});

/** 📋 Teacher fetches unanswered questions (Text + Audio) */
router.get("/get-questions", async (req, res) => {
  try {
    const questions = await Question.find({ answer: "" }, { answer: 0, answerAudio: 0 });
    console.log("✅ Unanswered Questions Fetched:", questions);

    res.json(questions);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

/** 📝 Teacher answers a question (Text + Audio) */
router.post("/answer-question", upload.single("audio"), async (req, res) => {
  try {
    const { questionId, answer, teacherEmail } = req.body;
    const answerAudio = req.file ? req.file.buffer.toString("base64") : null;

    if (!questionId || (!answer && !answerAudio) || !teacherEmail) {
      return res.status(400).json({ message: "Text or audio answer is required" });
    }

    // ✅ Update Question model with the answer
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { answer, answerAudio, teacherEmail },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // ✅ Save answer in Answer model separately
    const newAnswer = new Answer({
      studentEmail: updatedQuestion.studentEmail,
      question: updatedQuestion.question,
      answer: answer || "",
      audioPath: answerAudio ? `data:audio/webm;base64,${answerAudio}` : null,
      teacherEmail,
    });

    await newAnswer.save();
    console.log("✅ Answer saved:", newAnswer);

    res.json({ message: "Answer submitted successfully!", answer: newAnswer });
  } catch (error) {
    console.error("❌ Error submitting answer:", error);
    res.status(500).json({ message: "Error submitting answer" });
  }
});


module.exports = router;
