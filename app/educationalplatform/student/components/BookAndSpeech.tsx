"use client";
import { useState, useEffect, useRef } from "react";

const SpeechComponent = () => {
  const [speechText, setSpeechText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalText += event.results[i][0].transcript + " ";
            }
          }
          setSpeechText((prev) => prev + finalText);
        };

        recognitionRef.current.onend = () => setIsListening(false);
      } else {
        console.warn("Speech recognition is not supported in this browser.");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort(); // Safely abort to prevent null errors
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      console.warn("Speech recognition is not initialized.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      console.warn("Speech recognition is not initialized.");
    }
  };

  return (
    <div>
      <h2>🎤 Speech-to-Text</h2>
      <button onClick={startListening}>🎙 Start</button>
      <button onClick={stopListening}>⏹ Stop</button>
      <p>Recognized Text: {speechText}</p>
    </div>
  );
};

export default SpeechComponent;
