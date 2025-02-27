"use client";

import { useState } from "react";

export default function UploadQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newQuestions = [...questions];
    if (field === "question") newQuestions[index].question = value;
    if (field.startsWith("option")) newQuestions[index].options[parseInt(field.split("_")[1])] = value;
    if (field === "answer") newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!quizTitle || questions.some(q => !q.question || !q.answer)) return alert("Please fill in all fields.");

    const response = await fetch("http://localhost:5000/api/upload-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quizTitle, questions }),
    });

    if (response.ok) {
      alert("Quiz uploaded successfully!");
      setQuizTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
    } else {
      alert("Failed to upload quiz.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      {questions.map((q, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => handleChange(index, "question", e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {q.options.map((option, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={option}
              onChange={(e) => handleChange(index, `option_${i}`, e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={q.answer}
            onChange={(e) => handleChange(index, "answer", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={handleAddQuestion} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Add Question
      </button>
      <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-2">
        Submit Quiz
      </button>
    </div>
  );
}
