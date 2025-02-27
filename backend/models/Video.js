const express = require("express");
const router = express.Router();
const Video = require("../models/Video");

// DELETE /api/delete-video/:id
router.delete("/delete-video/:id", async (req, res) => {
  try {
    const videoId = req.params.id;

    // Find video in database
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "❌ Video not found" });
    }

    // Delete from MongoDB
    await Video.findByIdAndDelete(videoId);

    res.json({ message: "✅ Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "❌ Error deleting video" });
  }
});

module.exports = router;
