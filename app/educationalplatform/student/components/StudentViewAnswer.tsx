"use client";

import { useState, useEffect } from "react";

// ✅ Define the type for answers
interface Answer {
  question: string;
  answer: string;
  audioPath?: string; // Optional, because not all answers have audio
}

// ✅ Define props type
interface StudentViewAnswerProps {
  studentEmail: string;
}

const StudentViewAnswer: React.FC<StudentViewAnswerProps> = ({ studentEmail }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    async function fetchAnswers() {
      setLoading(true);
      try {
        console.log("Fetching answers for:", studentEmail);

        const response = await fetch(`http://localhost:5000/api/get-answers?studentEmail=${encodeURIComponent(studentEmail)}`);
        if (!response.ok) throw new Error("Failed to fetch answers");

        const data: Answer[] = await response.json(); // ✅ Explicitly define data type
        console.log("Fetched answers:", data);

        setAnswers(data);
      } catch (error) {
        console.error("❌ Error fetching answers:", error);
      } finally {
        setLoading(false);
      }
    }

    if (studentEmail) {
      fetchAnswers();
    }
  }, [studentEmail]);

  // 🎵 Play Answer Audio
  const playAudio = (audioUrl: string) => {
    if (!audioUrl) {
      alert("❌ No audio available!");
      return;
    }

    let audio = new Audio(audioUrl.startsWith("data:audio") ? audioUrl : `http://localhost:5000/${audioUrl}`);
    audio.play().catch(error => console.error("❌ Error playing audio:", error));
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md h-auto max-h-[500px] overflow-auto">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Your Answers</h2>

      {loading ? (
        <p className="text-gray-500">Loading answers...</p>
      ) : answers.length === 0 ? (
        <p className="text-gray-500">No answers available yet.</p>
      ) : (
        answers.map((item, index) => (
          <div key={index} className="p-3 border rounded mt-3 bg-white shadow-sm">
            <p className="font-semibold text-gray-800">Q: {item.question}</p>
            <p className="text-green-700 font-medium">A: {item.answer}</p>

            {item.audioPath && (
              <button
                onClick={() => playAudio(item.audioPath)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                ▶ Play Answer Audio
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentViewAnswer;
