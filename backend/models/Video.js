const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    videoName: { type: String, required: true },
    videoUrl: { type: String, required: true },
    teacherEmail: { type: String, required: true }, // Ensuring only teachers can upload
});

module.exports = mongoose.model("Video", VideoSchema);
