"use client";

import { useState } from "react";

const UploadQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<{ question: string; options: string[]; correctAnswer: string }[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Function to add a new question
  const addQuestion = () => {
    if (!newQuestion.trim() || newOptions.some(option => !option.trim()) || !correctAnswer.trim()) {
      alert("❌ Please fill all fields before adding a question.");
      return;
    }

    const updatedQuestions = [...questions, { question: newQuestion, options: newOptions, correctAnswer }];
    setQuestions(updatedQuestions);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  // ✅ Function to submit the quiz to the backend
  const handleSubmit = async () => {
    if (!quizTitle.trim() || questions.length === 0) {
      alert("❌ Please enter a quiz title and add at least one question.");
      return;
    }

    setLoading(true);

    const quizData = {
      title: quizTitle,
      questions: questions,
    };

    console.log("📤 Sending Quiz Data:", quizData);

    try {
      const response = await fetch("http://localhost:5000/api/quizzes/upload-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();
      console.log("✅ Server Response:", result);

      if (!response.ok) throw new Error(result.message || "Failed to submit quiz");

      alert("✅ Quiz uploaded successfully! Sent to students.");
      setQuizTitle("");
      setQuestions([]);
    } catch (error) {
      console.error("❌ Error submitting quiz:", error);
      alert("❌ Error submitting quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white shadow-md rounded-lg w-full max-w-2xl mx-auto h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-6">📚 Upload Quiz</h2>

      {/* ✅ Quiz Title Input */}
      <input
        type="text"
        placeholder="Enter Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      {/* ✅ Add Question Section */}
      <input
        type="text"
        placeholder="Enter Question"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      {newOptions.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => {
            const updatedOptions = [...newOptions];
            updatedOptions[index] = e.target.value;
            setNewOptions(updatedOptions);
          }}
          className="p-2 border rounded mb-2"
        />
      ))}

      {/* ✅ Correct Answer Selection */}
      <input
        type="text"
        placeholder="Enter Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      <button onClick={addQuestion} className="bg-blue-500 text-white py-2 px-4 rounded">
        ➕ Add Question
      </button>

      {/* ✅ Display Added Questions */}
      <div className="mt-6">
        <h3 className="text-lg font-bold">Quiz Questions</h3>
        {questions.map((q, idx) => (
          <div key={idx} className="p-2 border rounded mt-2">
            <p className="font-semibold">{q.question}</p>
            <ul className="list-disc ml-5">
              {q.options.map((opt, i) => (
                <li key={i} className={opt === q.correctAnswer ? "text-green-600" : ""}>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ✅ Submit Quiz Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Submitting..." : "📩 Submit Quiz to Students"}
      </button>
    </div>
  );
};

export default UploadQuiz;
