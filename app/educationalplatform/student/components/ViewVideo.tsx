"use client";

import { useEffect, useState, useRef } from "react";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic, Maximize } from "lucide-react";

interface Video {
  _id: string;
  videoName: string;
  videoUrl: string;
  teacherEmail: string;
}

interface ViewVideosProps {
  userRole: string;
  userEmail: string;
}

export default function ViewVideos({ userRole, userEmail }: ViewVideosProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // ✅ Fetch Videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("http://localhost:5000/api/get-videos");
        if (!response.ok) throw new Error("Failed to fetch videos");

        const data: Video[] = await response.json();
        setVideos(data);
      } catch (error) {
        setError("Failed to load videos. Please try again.");
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  // ✅ Delete Video
  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/delete-video/${videoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherEmail: userEmail }),
      });

      if (!response.ok) throw new Error("Error deleting video.");

      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
      alert("✅ Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("❌ Error deleting video.");
    }
  };

  // ✅ Full Screen Function
  const handleFullScreen = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md min-h-screen">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">🎥 View Video Lectures</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading videos...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : videos.length === 0 ? (
        <p className="text-center text-gray-600">No video lectures available.</p>
      ) : (
        <div className="overflow-x-auto p-4 bg-white rounded-lg shadow-md">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide p-4">
            {videos.map((video) => (
              <div key={video._id} className="bg-gray-200 p-4 rounded-lg shadow w-80 flex-shrink-0 relative">
                <video
                  ref={(el) => (videoRefs.current[video._id] = el)}
                  controls
                  className="w-full h-40 rounded-lg"
                >
                  <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Title */}
                <p className="text-sm text-gray-800 mt-2 font-semibold text-center">{video.videoName}</p>
                <p className="text-xs text-gray-500 text-center">Uploaded by: {video.teacherEmail}</p>

                {/* Full Screen Button */}
                <button
                  onClick={() => handleFullScreen(video._id)}
                  className="absolute top-2 right-2 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700"
                >
                  <Maximize className="h-4 w-4" />
                </button>

                {/* Delete Button (Only for Teacher) */}
                {userRole === "teacher" && userEmail === video.teacherEmail && (
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-xs mt-3 w-full hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Assistant */}
      {isAssistantOpen && <VoiceAssistant onClose={() => setIsAssistantOpen(false)} />}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg"
      >
        <Mic className="h-6 w-6" />
      </button>
    </div>
  );
}
