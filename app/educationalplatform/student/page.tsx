"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DescribeImage from "./components/DescribeImage";
import VideoWithDescription from "./components/ViewVideo";
import QuestionAnswer from "./components/QuestionAnswer";
import StudentViewAnswer from "./components/StudentViewAnswer"; // ✅ Added Student View Answer Component

export default function StudentDashboard() {
  const [activeModal, setActiveModal] = useState<"image" | "video" | "tts" | "qa" | "viewAnswer" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [user, setUser] = useState<{ email: string; userType: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    if (!loggedInUser || loggedInUser.userType !== "student") {
      router.push("/login"); // Redirect if not a student
    } else {
      setUser(loggedInUser);
    }
  }, [router]);

  const openModal = (type: "image" | "video" | "tts" | "qa" | "viewAnswer") => {
    if (!isModalOpen) {
      setActiveModal(type);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsModalOpen(false);
    setTextInput("");
  };

  const handleTextToSpeech = () => {
    if (textInput.trim() === "") return;
    const speech = new SpeechSynthesisUtterance(textInput);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  return (
    <div className={`min-h-screen bg-gray-100 py-12 relative ${activeModal ? "overflow-hidden" : ""}`}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-purple-600">Welcome, {user?.email || "Student"}</h2>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <p className="text-center text-gray-600 mb-10">
          Enhance your learning experience with AI-powered tools.
        </p>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            
            { icon: "🎥", title: "Video Lecture", desc: "learn through video", action: () => openModal("video") },
            { icon: "🔊", title: "BookReader", desc: "Convert text into spoken words", action: () => openModal("tts") },
            { icon: "🤖", title: "Doubts", desc: "Ask and answer questions", action: () => openModal("qa") },
            { icon: "📜", title: "View Answers", desc: "See answers from teachers", action: () => openModal("viewAnswer") }, // ✅ Added View Answer Option
            {
              icon: "📖",
              title: "Assignment Writing",
              desc: "convert speech to text",
              action: () => router.push("/educationalplatform/student/book-and-speech"),
            },
            {
              icon: "📝",
              title: "Quizzes",
              desc: "Take quizzes and explore",
              action: () => router.push("/educationalplatform/student/quizzes-and-more"),
            },
          ].map(({ icon, title, desc, action }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-100 transform hover:scale-105 transition-all"
              onClick={action}
            >
              <div className="text-5xl mb-3">{icon}</div>
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
            >
              <h3 className="text-2xl font-bold text-purple-600 mb-4 text-center">
                {activeModal === "image"
                  ? "Upload an Image"
                  : activeModal === "video"
                  ? "Upload a Video"
                  : activeModal === "tts"
                  ? "Text-to-Speech"
                  : activeModal === "qa"
                  ? "Question & Answer"
                  : "View Teacher's Answers"}
              </h3>

              {activeModal === "image" && <DescribeImage />}
              {activeModal === "video" && <VideoWithDescription />}
              {activeModal === "tts" && (
                <div>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter text to convert to speech..."
                    rows={4}
                  />
                  <div className="flex justify-center mt-4 gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleTextToSpeech}>
                      Convert to Speech
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={closeModal}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
              {activeModal === "qa" && <QuestionAnswer />}
              {activeModal === "viewAnswer" && <StudentViewAnswer />} {/* ✅ Student Can View Answers */}
              <div className="flex justify-center mt-4">
                <Button className="bg-red-600 hover:bg-red-700" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
