const express = require("express");
const Answer = require("../models/Answer");
const Question = require("../models/Question");

const router = express.Router();

/** 🎓 Student fetches their answered questions (Text + Audio) */
router.get("/get-answers", async (req, res) => {
  try {
    const { studentEmail } = req.query;

    if (!studentEmail) {
      return res.status(400).json({ message: "Student email is required" });
    }

    // ✅ Fetch answers from Answer model
    const textAnswers = await Answer.find({ studentEmail });
    console.log("✅ Text Answers Found:", textAnswers);

    // ✅ Fetch answers from Question model
    const questionAnswers = await Question.find({
      studentEmail,
      answer: { $ne: "" }, // Only get answered questions
    });
    console.log("✅ Question Answers Found:", questionAnswers);

    // Combine all answers into a consistent format
    const allAnswers = [
      ...textAnswers.map(a => ({
        question: a.question,
        answer: a.answer,
        audioPath: a.audioPath
      })),
      ...questionAnswers.map(q => ({
        question: q.question,
        answer: q.answer,
        audioPath: q.answerAudio
      }))
    ];

    console.log("✅ Final Answers Sent to Student:", allAnswers);
    res.json(allAnswers);
  } catch (error) {
    console.error("❌ Error fetching answers:", error);
    res.status(500).json({ message: "Error fetching answers" });
  }
});

module.exports = router;
