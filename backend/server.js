const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");
const answerRoutes = require("./routes/answerRoutes");
const videoRoutes = require("./routes/videoRoutes");

dotenv.config();

// Connect to Database
connectDB().then(() => console.log("✅ Database connected successfully")).catch(err => {
  console.error("❌ Database connection failed:", err);
  process.exit(1); // Exit if DB fails to connect
});

const app = express();

app.use(express.json());
app.use(cors());

// Serve uploaded files (if needed)
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/videos", videoRoutes); // ✅ Corrected route for videos

// 404 Route Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route Not Found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
