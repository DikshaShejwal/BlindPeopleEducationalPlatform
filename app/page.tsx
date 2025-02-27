"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Chatbot } from "@/components/Chatbot";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [highlightAuth, setHighlightAuth] = useState(false);

  const handleTryNowClick = () => {
    setHighlightAuth(true); // Activate highlight effect
    setTimeout(() => setHighlightAuth(false), 3000); // Remove highlight after 3 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              Perceiva
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/forums">Forums</Link>
              <Link href="/login">
                <Button className={`transition-all ${highlightAuth ? "bg-red-500 scale-110" : ""}`}>
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className={`bg-purple-600 hover:bg-purple-700 transition-all ${highlightAuth ? "bg-red-500 scale-110" : ""}`}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          {highlightAuth && (
            <p className="text-center text-red-500 font-bold mt-2">⚠️ Login is necessary to proceed!</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-12rem)]">
            {/* Left Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-4">Netra AI</h2>
              <p className="text-gray-600 mb-6">
                Netra AI is an AI-powered solution aimed at helping visually impaired individuals 
                perceive the world around them. It uses on-device AI processing with ESP32 for offline 
                recognition and integrates cloud APIs for complex tasks like real-time object and scene 
                interpretation. Key features include facial recognition for personalized interactions, 
                photo-to-voice descriptions, and video summarization with text-to-speech (TTS) output. 
                A companion app enhances accessibility through educational resources, forums, and 
                sound-based visualization for community learning.
              </p>
              <Link href="/netra">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">Try Now</Button>
              </Link>
            </motion.div>

            {/* Right Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-4">Voicea</h2>
              <p className="text-gray-600 mb-6">
                Voicea focuses on revolutionizing inclusive digital learning for specially-abled individuals. 
                It provides real-time, AI-driven solutions for accessible education through sound-based feedback 
                and community interaction. The platform offers tools like personalized learning resources, a 
                discussion forum for collaborative learning, and multi-sensory engagement using haptic feedback. 
                Future developments include multi-language support to ensure broader adoption and integration 
                with assistive technologies for enhanced usability.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6" onClick={handleTryNowClick}>
                Try Now
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Chatbot */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
        </div>
      </main>
    </div>
  );
}
