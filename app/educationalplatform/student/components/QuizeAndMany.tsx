"use client";
import React, { useState, useEffect, useRef } from "react";

const questions = [
  { question: "What is 2 plus 2?", answer: "four" },
  { question: "What is the capital of France?", answer: "paris" },
  { question: "How many legs does a spider have?", answer: "eight" },
];

const VoiceQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();

        if (recognitionRef.current) {
          recognitionRef.current.continuous = false;
          recognitionRef.current.lang = "en-US";

          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            checkAnswer(transcript);
          };

          recognitionRef.current.onend = () => setIsListening(false);
        }
      } else {
        console.warn("Speech recognition is not supported in this browser.");
      }
    }
  }, []);

  const readQuestion = (question: string) => {
    if (typeof window !== "undefined") {
      const speech = new SpeechSynthesisUtterance(question);
      speech.lang = "en-US";
      speech.rate = 0.9;
      speech.onend = () => startListening();
      window.speechSynthesis.speak(speech);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const checkAnswer = (answer: string) => {
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

    if (answer.includes(correctAnswer)) {
      setScore((prevScore) => prevScore + 1);
      provideFeedback("Correct answer!");
    } else {
      provideFeedback(`Wrong answer. The correct answer is ${correctAnswer}`);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        readQuestion(questions[currentQuestionIndex + 1].question); // Read next question automatically
      } else {
        readFinalScore();
      }
    }, 2000);
  };

  const provideFeedback = (message: string) => {
    if (typeof window !== "undefined") {
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = "en-US";
      speech.rate = 1;
      window.speechSynthesis.speak(speech);
    }
  };

  const readFinalScore = () => {
    provideFeedback(`Quiz over. Your final score is ${score} out of ${questions.length}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-10">
      <h1 className="text-4xl font-bold text-purple-600 mb-6">🎤 Voice Quiz for Blind Students</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">
          Question {currentQuestionIndex + 1}
        </h2>
        <p className="text-lg text-gray-800 mb-6">{questions[currentQuestionIndex].question}</p>

        <div className="flex gap-4 mt-4 justify-center">
          {isListening ? (
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
              🎙 Listening...
            </button>
          ) : (
            <button
              onClick={() => readQuestion(questions[currentQuestionIndex].question)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              🔊 Read Question Again
            </button>
          )}
        </div>
      </div>

      <h3 className="mt-6 text-xl font-bold text-gray-700">
        Score: {score} / {questions.length}
      </h3>
    </div>
  );
};

export default VoiceQuiz;
