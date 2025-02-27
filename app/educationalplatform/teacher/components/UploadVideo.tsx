"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UploadAndManageVideos() {
  const [video, setVideo] = useState<File | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for upload
  const router = useRouter();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-videos");
      if (!response.ok) throw new Error("Failed to fetch videos");

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size > 100 * 1024 * 1024) {
      alert("❌ File is too large! Please upload a video smaller than 100MB.");
      return;
    }
    setVideo(file);
  };

  const handleUpload = async () => {
    if (!video) {
      alert("⚠ Please select a video to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("video", video);
    formData.append("teacherEmail", "teacher@example.com");

    try {
      const response = await fetch("http://localhost:5000/api/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Video uploaded successfully!");
        setVideo(null);
        fetchVideos();
      } else {
        alert(`❌ Error: ${data.error || "Failed to upload video."}`);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("❌ Error uploading video.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/delete-video/${videoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Video deleted successfully!");
        setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
      } else {
        const data = await response.json();
        alert(`❌ Error: ${data.message || "Failed to delete video."}`);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("❌ Error deleting video.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md w-full max-w-3xl mx-auto relative">
      {/* Back Button */}
      <Button onClick={() => router.push("/educationalplatform/teacher")} className="absolute top-4 left-4 bg-gray-500 text-white">
        ⬅ Back
      </Button>

      {/* Upload Section */}
      <h2 className="text-xl font-bold text-purple-600 text-center mb-4">Upload a Video</h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full p-2 border border-gray-300 rounded-md mb-4"
        disabled={loading}
      />
      <Button onClick={handleUpload} className="bg-blue-600 text-white w-full mb-6" disabled={loading}>
        {loading ? "Uploading..." : "Upload Video"}
      </Button>

      {/* Uploaded Videos Section */}
      <h2 className="text-xl font-bold text-purple-600 text-center mb-4">Your Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p className="text-center text-gray-600">No videos available.</p>
      ) : (
        <div className="overflow-x-auto p-2">
          <div className="flex flex-wrap gap-4 justify-center">
            {videos.map((video, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow w-56 flex-shrink-0">
                <video controls className="w-full h-32 rounded-lg">
                  <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="text-xs text-gray-600 mt-1">Uploaded by: {video.teacherEmail}</p>

                {/* Delete Button */}
                <Button
                  onClick={() => handleDeleteVideo(video._id)}
                  className="bg-red-600 text-white w-full mt-1 text-xs"
                >
                  🗑 Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
