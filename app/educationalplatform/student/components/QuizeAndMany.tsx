"use client";

import { useState, useEffect } from "react";

const StudentQuiz = () => {
  const [quizzes, setQuizzes] = useState<
    { _id: string; title: string; questions: { question: string; options: string[]; correctAnswer: string }[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quizzes/get-quizzes", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Failed to fetch quizzes (Status: ${response.status})`);

        const data = await response.json();
        if (data.length === 0) throw new Error("No quizzes found.");
        console.log("📥 Received Quizzes:", data);
        setQuizzes(data);
      } catch (error) {
        console.error("❌ Error fetching quizzes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="p-10 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📝 Available Quizzes</h2>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz._id} className="p-4 border rounded mb-4">
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            {quiz.questions.map((q, idx) => (
              <div key={idx} className="mt-2">
                <p className="font-semibold">{q.question}</p>
                <ul className="list-disc ml-5">
                  {q.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentQuiz;
