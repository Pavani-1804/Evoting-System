const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST: Add new feedback
router.post("/", async (req, res) => {
  try {
    const { message, rating } = req.body;
    let name = "Anonymous Voter";

    const token = req.headers.authorization;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          name = user.name;
        }
      } catch (err) {
        console.error("Feedback Auth Error:", err);
      }
    }

    if (!message) {
      return res.status(400).json({ message: "Feedback message is required" });
    }

    const feedback = await Feedback.create({
      name,
      message,
      rating: Number(rating) || 5
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(6);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
