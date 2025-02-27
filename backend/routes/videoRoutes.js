const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // Use async-friendly file system
const Video = require("../models/Video");

const router = express.Router();

// Ensure "uploads/videos" directory exists
const uploadDir = path.join(__dirname, "../uploads/videos");
require("fs").mkdirSync(uploadDir, { recursive: true });

// ✅ Multer Configuration for Video Uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ✅ Upload Video
router.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "❌ No video uploaded" });

    const { teacherEmail } = req.body;
    const newVideo = new Video({
      teacherEmail,
      videoUrl: `/uploads/videos/${req.file.filename}`,
    });

    await newVideo.save();
    res.status(201).json({ message: "✅ Video uploaded successfully", videoUrl: newVideo.videoUrl });
  } catch (error) {
    console.error("❌ Error uploading video:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

// ✅ Fetch All Videos
router.get("/get-videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

// ✅ Delete Video by ID
router.delete("/delete-video/:id", async (req, res) => {
  try {
    const videoId = req.params.id;

    // Find video in database
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: "❌ Video not found" });

    // Delete video file from server
    const videoPath = path.join(__dirname, "..", video.videoUrl);
    try {
      await fs.unlink(videoPath);
      console.log(`🗑 Deleted video file: ${video.videoUrl}`);
    } catch (err) {
      console.warn(`⚠ Could not delete file: ${video.videoUrl} (File may not exist)`);
    }

    // Delete from MongoDB
    await Video.findByIdAndDelete(videoId);
    console.log(`✅ Deleted video from database: ${videoId}`);

    res.status(204).send(); // No content response
  } catch (error) {
    console.error("❌ Error deleting video:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

// ✅ Serve Video Files
router.use("/uploads/videos", express.static(uploadDir));

module.exports = router;
