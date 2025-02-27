"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ViewVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("http://localhost:5000/api/get-videos");
        if (!response.ok) throw new Error("Failed to fetch videos");

        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }

    fetchVideos();
  }, []);

  // Play video in fullscreen mode
  const handleFullScreen = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).mozRequestFullScreen) {
        (video as any).mozRequestFullScreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
      video.play();
    }
  };

  // Stop video playback
  const handleStopVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Uploaded Videos</h2>

      {/* Back Button */}
      <Button onClick={() => router.back()} className="bg-red-500 text-white mb-4">
        🔙 Back
      </Button>

      {videos.length === 0 ? (
        <p className="text-center text-gray-600">No videos available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                controls
                className="w-full h-56 rounded-lg"
              >
                <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm text-gray-600 mt-2">Uploaded by: {video.teacherEmail}</p>

              {/* Buttons */}
              <div className="flex justify-between mt-2">
                <Button onClick={() => handleFullScreen(index)} className="bg-blue-500 text-white">
                  ⛶ Full Screen
                </Button>
                <Button onClick={() => handleStopVideo(index)} className="bg-red-500 text-white">
                  ⏹ Stop
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
