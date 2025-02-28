"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic } from "lucide-react";

const UploadVideo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState<{ _id?: string; name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  // Load videos from backend and localStorage
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("http://localhost:5000/api/get-videos");
        if (!response.ok) throw new Error("Failed to fetch videos");
        
        const data = await response.json();
        setUploadedVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }

    const storedVideos = JSON.parse(localStorage.getItem("uploadedVideos") || "[]");
    setUploadedVideos((prev) => [...storedVideos, ...prev]);

    fetchVideos();
  }, []);

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Upload Video to Backend
  const handleUpload = async () => {
    if (!selectedFile || !videoName.trim()) {
      alert("Please select a file and enter a video name.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("videoFile", selectedFile);
    formData.append("videoName", videoName);
    formData.append("teacherEmail", "teacher@example.com"); // Replace with actual teacher email

    try {
      const response = await fetch("http://localhost:5000/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const newVideo = await response.json();
      
      setUploadedVideos((prev) => [...prev, newVideo]);
      localStorage.setItem("uploadedVideos", JSON.stringify([...uploadedVideos, newVideo]));

      setSelectedFile(null);
      setVideoName("");
      alert("✅ Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("❌ Error uploading video.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Video
  const handleDelete = async (videoId?: string, index?: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    if (videoId) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-video/${videoId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete video");
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("❌ Error deleting video.");
        return;
      }
    }

    const updatedVideos = uploadedVideos.filter((_, i) => i !== index);
    setUploadedVideos(updatedVideos);
    localStorage.setItem("uploadedVideos", JSON.stringify(updatedVideos));
    alert("✅ Video deleted successfully!");
  };

  // Start Video Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);
    setRecordedChunks([]);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
  };

  // Stop Video Recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // Save Recorded Video
  useEffect(() => {
    if (recordedChunks.length > 0) {
      const recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(recordedBlob);
      setSelectedFile(new File([recordedBlob], "recorded-video.mp4", { type: "video/mp4" }));
    }
  }, [recordedChunks]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center text-purple-700">Upload or Record a Video</h2>
        
        <input type="file" accept="video/*" onChange={handleFileChange} className="mt-4 w-full" />
        <input
          type="text"
          placeholder="Enter video name"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          className="mt-2 w-full p-2 border rounded"
        />
        
        {recording ? (
          <button onClick={stopRecording} className="mt-2 w-full bg-red-600 text-white py-2 rounded">Stop Recording</button>
        ) : (
          <button onClick={startRecording} className="mt-2 w-full bg-green-600 text-white py-2 rounded">Start Recording</button>
        )}
        
        <button onClick={handleUpload} className="mt-4 w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
          {loading ? "Uploading..." : "Upload Video"}
        </button>
        
        <button onClick={() => router.push("/educationalplatform/teacher")} className="mt-2 w-full bg-red-600 text-white py-2 rounded">
          Close
        </button>
        
        {uploadedVideos.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Uploaded Videos</h3>
            {uploadedVideos.map((video, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded mt-2">
                <p className="flex-1">{video.name}</p>
                <button onClick={() => window.open(video.url, "_blank")} className="text-blue-500">🔍</button>
                <button onClick={() => handleDelete(video._id, index)} className="text-red-500">🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default UploadVideo;
