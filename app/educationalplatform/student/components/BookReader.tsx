"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import to prevent SSR issues with pdfjs-dist
const pdfjsLibPromise = import("pdfjs-dist/build/pdf").then((pdfjs) => {
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";
  return pdfjs;
});

const BookReader = () => {
  const [pdfText, setPdfText] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const router = useRouter();

  // Load PDF.js dynamically (fixes Next.js issues)
  useEffect(() => {
    pdfjsLibPromise.then(setPdfjsLib);
  }, []);

  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib) {
      alert("PDF library not loaded. Please try again.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        try {
          const pdfData = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let extractedText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map((item) => item.str).join(" ") + " ";
          }

          if (!extractedText.trim()) throw new Error("No extractable text found in the PDF.");
          setPdfText(extractedText);
          readTextAloud(extractedText); // Auto-start reading
        } catch (error) {
          console.error("Error extracting text from PDF:", error);
          alert("Failed to extract text. Try another PDF.");
        }
      };
    } catch (error) {
      console.error("Error reading PDF file:", error);
      alert("Error reading file.");
    }
  };

  // Handle PDF Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected. Please choose a PDF.");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Invalid file type. Only PDFs are allowed.");
      return;
    }

    extractTextFromPDF(file);
  };

  // Read Aloud Function
  const readTextAloud = (text) => {
    if (!text.trim() || !synth) return;

    if (isReading) {
      synth.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.onend = () => setIsReading(false);

    setIsReading(true);
    synth.speak(utterance);
  };

  // Stop Speech
  const stopReading = () => {
    synth?.cancel();
    setIsReading(false);
  };

  // Navigate to Dashboard
  const navigateToDashboard = () => {
    synth?.cancel();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10">
      <h1 className="text-5xl font-extrabold text-blue-400 tracking-wide mb-10">📖 Book Reader</h1>

      {/* File Upload Button */}
      <input
        type="file"
        accept="application/pdf"
        className="w-96 text-lg bg-gray-800 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 shadow-lg mb-6"
        onChange={handleFileUpload}
      />

      {/* Controls */}
      <div className="flex justify-center gap-6">
        <button
          onClick={() => readTextAloud(pdfText)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-green-500 transition transform hover:scale-105"
        >
          🔊 Read Aloud
        </button>
        <button
          onClick={stopReading}
          className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-red-500 transition transform hover:scale-105"
        >
          ⛔ Stop Reading
        </button>
        <button
          onClick={navigateToDashboard}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-500 transition transform hover:scale-105"
        >
          🔙 Dashboard
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(BookReader), { ssr: false });