const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Video = require("../models/Video"); // ✅ Ensure correct model import

const router = express.Router();

// ✅ Ensure 'uploads/videos' directory exists
const uploadDir = path.join(__dirname, "../uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage configuration for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ✅ Teacher uploads a video
router.post("/upload-video", upload.single("videoFile"), async (req, res) => {
  try {
    const { videoName, teacherEmail } = req.body;

    if (!teacherEmail) {
      return res.status(400).json({ error: "Teacher email is required to upload videos." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded." });
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const newVideo = new Video({ videoName, videoUrl, teacherEmail });
    await newVideo.save();

    res.status(201).json({ message: "✅ Video uploaded successfully!", videoUrl });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

// ✅ Students fetch uploaded videos
router.get("/get-videos", async (req, res) => {
  try {
    const videos = await Video.find({});
    res.json(videos);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// ✅ Teacher deletes a video (only if they uploaded it)
router.delete("/delete-video/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { teacherEmail } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "❌ Video not found" });
    }

    // Ensure only the teacher who uploaded it can delete
    if (video.teacherEmail !== teacherEmail) {
      return res.status(403).json({ error: "❌ Unauthorized to delete this video" });
    }

    // Remove video file from the server
    const filePath = path.resolve(__dirname, "..", video.videoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // ✅ Delete the video file
    }

    await Video.findByIdAndDelete(videoId);
    res.json({ message: "✅ Video deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
});

// ✅ Serve video files statically
router.use("/uploads/videos", express.static(uploadDir));

module.exports = router;
