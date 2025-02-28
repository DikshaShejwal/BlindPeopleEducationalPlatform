const express = require("express");
const bcrypt = require("bcryptjs"); // ✅ Use bcryptjs (lighter & optimized)
const jwt = require("jsonwebtoken");
const User = require("../models/user");
 
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Validate input
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in database
    const newUser = new User({ name, email, password: hashedPassword, userType });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully!", userType });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token (Expires in 7 days)
    const token = jwt.sign({ id: user._id, email: user.email, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ 
      message: "Login successful!", 
      user: { name: user.name, email: user.email, userType: user.userType }, 
      token 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
