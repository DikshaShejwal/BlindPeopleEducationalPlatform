"use client";
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "@tensorflow/tfjs";

const DescribeImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        setImage(base64Image);
        await extractTextFromImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractTextFromImage = async (base64Image: string) => {
    setIsLoading(true);
    setExtractedText("");
    try {
      const { data: { text } } = await Tesseract.recognize(base64Image, "eng");
      const cleanedText = cleanExtractedText(text);
      setExtractedText(cleanedText);
      speakText(cleanedText);
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Failed to extract text. Please try again.");
    }
    setIsLoading(false);
  };

  const cleanExtractedText = (text: string): string => {
    return text
      .replace(/[^a-zA-Z0-9\s.,'"-]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
  };

  const cancelSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-lg font-bold">Upload an Image to Read the Text</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Uploaded" className="w-64 h-64 object-cover rounded-md" />}
      {isLoading && <p className="text-gray-500">Extracting text...</p>}
      {extractedText && (
        <div className="mt-4 p-3 border rounded-lg bg-gray-100">
          <p className="text-gray-700">{extractedText}</p>
        </div>
      )}
      {isSpeaking && (
        <button
          onClick={cancelSpeech}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Cancel Speech
        </button>
      )}
    </div>
  );
};

export default DescribeImage;