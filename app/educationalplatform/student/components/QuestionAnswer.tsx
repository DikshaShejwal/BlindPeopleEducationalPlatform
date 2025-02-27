"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function QuestionAnswer() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState(""); // Speech-to-text output
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // ✅ Initialize Speech Recognition on Component Mount
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.lang = "en-US";
        recognitionInstance.interimResults = false;

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setTranscribedText(transcript);
          console.log("🎤 Transcribed:", transcript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event);
        };

        setRecognition(recognitionInstance);
      } else {
        console.warn("⚠ Speech recognition is not supported in this browser.");
      }
    }
  }, []);

  // ✅ Start Recording
  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      setTranscribedText(""); // Clear previous input
      recognition.start();
    } else {
      alert("⚠ Speech recognition is not supported in this browser.");
    }
  };

  // ✅ Stop Recording
  const stopRecording = () => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();
    }
  };

  // ✅ Submit Transcribed Question to Backend
  const sendQuestion = async () => {
    if (!transcribedText.trim()) {
      alert("⚠ Please record a question first!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/questions/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: "student@example.com", // Replace with actual logged-in student email
          question: transcribedText, // ✅ Send transcribed text only
        }),
      });

      if (response.ok) {
        alert("✅ Question submitted successfully!");
        setTranscribedText("");
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to submit question: ${errorData.message}`);
      }
    } catch (error) {
      console.error("❌ Error submitting question:", error);
      alert("❌ Server error. Please try again later.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Ask a Question</h2>

      {/* ✅ Display Transcribed Text */}
      <p className="text-lg font-semibold text-gray-700">
        🎙️ Recorded Question: {transcribedText || "Waiting for input..."}
      </p>

      {/* ✅ Audio Recording Buttons */}
      <div className="flex gap-3 mt-4">
        {isRecording ? (
          <Button onClick={stopRecording} className="bg-red-600 text-white">
            Stop Recording 🎤
          </Button>
        ) : (
          <Button onClick={startRecording} className="bg-green-600 text-white">
            Record Question 🎤
          </Button>
        )}
      </div>

      {/* ✅ Submit Button */}
      <div className="flex gap-3 mt-4">
        <Button onClick={sendQuestion} className="bg-blue-500 text-white">
          📩 Submit Question
        </Button>
      </div>
    </div>
  );
}
