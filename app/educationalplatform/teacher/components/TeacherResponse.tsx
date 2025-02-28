"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TeacherResponse() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [answer, setAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // ✅ Fetch Unanswered Questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("http://localhost:5000/api/questions/get-questions");
        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, []);

  // ✅ Convert Answer to Speech (Before Submission)
  const handleTextToSpeech = () => {
    if (!answer.trim()) return;

    setIsSpeaking(true);
    const speech = new SpeechSynthesisUtterance(answer);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  // ✅ Handle Answer Submission (Text + Audio)
  const handleSubmitAnswer = async () => {
    if (!selectedQuestion) return alert("Select a question first!");
    if (!answer.trim()) return alert("Answer cannot be empty!");

    setIsAnswering(true);

    const formData = new FormData();
    formData.append("questionId", selectedQuestion._id);
    formData.append("answer", answer);
    formData.append("teacherEmail", "teacher@example.com"); // Replace with actual logged-in teacher's email

    if (audioBlob) {
      formData.append("audio", audioBlob, "answer-audio.webm");
    }

    try {
      const response = await fetch("http://localhost:5000/api/questions/answer-question", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Answer submitted successfully!");
        setAnswer("");
        setSelectedQuestion(null);
        setAudioBlob(null);
      } else {
        alert("❌ Error submitting answer.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Unanswered Questions</h2>

      {questions.length === 0 ? (
        <p className="text-center text-gray-600">No unanswered questions available.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q, index) => (
            <li
              key={index}
              className={`p-4 bg-white rounded-lg shadow cursor-pointer ${
                selectedQuestion?._id === q._id ? "border-2 border-purple-600" : ""
              }`}
              onClick={() => setSelectedQuestion(q)}
            >
              <p className="text-lg font-semibold">{q.question}</p>
              <p className="text-sm text-gray-500">Asked by: {q.studentEmail}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Answer Input */}
      {selectedQuestion && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Answer:</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Type your answer..."
            rows={3}
          />

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmitAnswer} disabled={isAnswering} className="bg-blue-600 text-white">
              {isAnswering ? "Submitting..." : "Submit Answer"}
            </Button>

            <Button onClick={handleTextToSpeech} disabled={isSpeaking} className="bg-green-600 text-white">
              🔊 Convert to Speech
            </Button>
          </div>
        </div>
      )}
      
    </div>
  );
}
