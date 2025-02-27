"use client";

import { useState, useEffect } from "react";

export default function StudentViewAnswer() {
  const [answers, setAnswers] = useState<any[]>([]);
  const studentEmail = "student@example.com"; // Replace with dynamic logged-in student email

  useEffect(() => {
    async function fetchAnswers() {
      try {
        const response = await fetch(`http://localhost:5000/api/get-answers?studentEmail=${studentEmail}`);
        if (!response.ok) throw new Error("Failed to fetch answers");

        const data = await response.json();

        // Ensure the response contains valid audio URLs
        const formattedAnswers = data.map((answer: any) => ({
          ...answer,
          audioUrl: answer.audioUrl ? new URL(answer.audioUrl, "http://localhost:5000").href : null,
        }));

        setAnswers(formattedAnswers);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    }
    fetchAnswers();
  }, []);

  const playAudio = (audioUrl: string) => {
    if (!audioUrl) {
      alert("Audio not available!");
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Your Answers</h2>

      {answers.length === 0 ? (
        <p className="text-center text-gray-600">No answers available.</p>
      ) : (
        <ul className="space-y-4">
          {answers.map((answer, index) => (
            <li key={index} className="p-4 bg-white rounded-lg shadow">
              <p className="text-lg font-semibold">Q: {answer.question}</p>
              <p className="text-sm text-gray-500">A: {answer.answer}</p>
              {answer.audioUrl ? (
                <button
                  onClick={() => playAudio(answer.audioUrl)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  🎵 Play Answer
                </button>
              ) : (
                <p className="text-red-500 text-sm mt-2">No audio available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
