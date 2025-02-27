"use client";
import React, { useState, useEffect } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fetch available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Function to handle speech synthesis
  const speakText = () => {
    if (!text.trim()) return alert("Please enter some text.");

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ensure a matching voice is selected
    const selectedVoice = voices.find((v) => v.lang.startsWith(language));
    utterance.voice = selectedVoice || null;

    utterance.lang = language;
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  // Stop Speech
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-purple-600">🔊 Multi-Language TTS</h2>

      {/* Text Input */}
      <textarea
        className="border p-3 w-full h-32 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Language Selection */}
      <div className="flex flex-col w-full">
        <label className="font-bold mb-1">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="hi-IN">Hindi</option>
          <option value="de-DE">German</option>
          <option value="zh-CN">Chinese (Mandarin)</option>
          <option value="ja-JP">Japanese</option>
          <option value="ar-SA">Arabic</option>
        </select>
      </div>

      {/* Speech Rate Control */}
      <div className="flex items-center space-x-2 w-full">
        <label className="font-bold">Speech Rate:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full"
        />
        <span>{rate.toFixed(1)}x</span>
      </div>

      {/* Speak and Stop Buttons */}
      <div className="flex space-x-3">
        <button onClick={speakText} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Speak
        </button>
        {isSpeaking && (
          <button onClick={stopSpeech} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
