"use client";

import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";

const SpeechWriter = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const synthesisRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize SpeechSynthesis
  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
  }, []);

  // Auto-scroll textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text]);

  // Calculate character and word count
  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const startSpeaking = () => {
    if (text.trim() === "" || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      alert("Started speaking");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      alert("Finished speaking");
    };

    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      alert("Stopped speaking");
    }
  };

  const clearText = () => {
    setText("");
    alert("Text cleared");
  };

  const downloadPDF = () => {
    if (!text.trim()) {
      alert("No text to download");
      return;
    }

    setIsDownloading(true);
    alert("Generating PDF...");

    setTimeout(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth() - 20;
      const wrappedText = doc.splitTextToSize(text, pageWidth);
      doc.text(wrappedText, 10, 10);
      doc.save("speech_text.pdf");

      setIsDownloading(false);
      alert("PDF downloaded successfully");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-35 py-35">
      {/* Notepad Container */}
      <div className="relative w-full max-w-4xl h-[85vh] bg-white shadow-2xl rounded-3xl p-10 border-2 border-gray-400 text-gray-900 flex flex-col">
        {/* Title */}
        <h1 className="text-center text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
          🎤 Speech-to-Text Notepad
        </h1>

        {/* Text Display */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full flex-grow p-6 border border-gray-600 rounded-xl text-gray-900 text-xl focus:outline-none shadow-lg bg-gray-50 resize-none"
          placeholder="Type here or paste your text..."
        />

        {/* Character and Word Count */}
        <div className="mt-4 text-sm text-gray-600">
          <p>Characters: {characterCount}</p>
          <p>Words: {wordCount}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {/* Text-to-Speech Controls */}
          <button
            onClick={startSpeaking}
            disabled={isSpeaking || text.trim() === ""}
            className={`px-6 py-3 rounded-lg text-lg font-semibold shadow-lg ${
              isSpeaking || text.trim() === ""
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            🔊 Start Speaking
          </button>
          <button
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className={`px-6 py-3 rounded-lg text-lg font-semibold shadow-lg ${
              !isSpeaking
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            ⏹ Stop Speaking
          </button>

          {/* Clear and Download Controls */}
          <button
            onClick={clearText}
            className="bg-red-600 hover:bg-red-700 transition-all duration-300 text-white px-6 py-3 rounded-lg text-lg shadow-lg"
          >
            🗑 Clear
          </button>
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className={`px-6 py-3 rounded-lg text-lg font-semibold shadow-lg ${
              isDownloading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isDownloading ? "⏳ Downloading..." : "📥 Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechWriter;