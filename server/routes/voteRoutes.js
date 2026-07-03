const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Candidate = require("../models/Candidate");

// VOTE API
router.post("/:candidateId", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify election is currently live
    const Settings = require("../models/Settings");
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const now = new Date();
    const start = new Date(settings.startDate);
    const end = new Date(settings.endDate);

    if (now < start) {
      return res.status(400).json({ message: "Voting hasn't started yet. The election is upcoming." });
    }
    if (now > end) {
      return res.status(400).json({ message: "Voting has ended. The election is completed." });
    }

    const user = await User.findById(decoded.id);

    if (user.hasVoted) {
      return res.status(400).json({ message: "You already voted" });
    }

    const candidate = await Candidate.findById(req.params.candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.votes += 1;
    await candidate.save();

    user.hasVoted = true;
    await user.save();

    res.json({ message: "Vote submitted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;