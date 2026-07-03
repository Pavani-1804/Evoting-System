const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Settings = require("../models/Settings");
const User = require("../models/User");
const verifyAdmin = require("../middleware/auth");
const adminCheck = require("../middleware/admin");

// GET ELECTION SETTINGS (PUBLIC)
router.get("/election-settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ELECTION SETTINGS (ADMIN)
router.post("/election-settings", verifyAdmin, adminCheck, async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.title = title || settings.title;
    settings.description = description || settings.description;
    if (startDate) settings.startDate = new Date(startDate);
    if (endDate) settings.endDate = new Date(endDate);

    await settings.save();
    res.json({ message: "Election settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD CANDIDATE (ADMIN)
router.post("/add", verifyAdmin, adminCheck, async (req, res) => {
  try {
    const { name, party, age, education, experience, manifesto, photo, motto, partySymbol } = req.body;

    const candidate = await Candidate.create({
      name,
      party,
      age: age ? Number(age) : undefined,
      education,
      experience,
      manifesto,
      photo: photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`, // dynamic avatar generator
      motto: motto || "",
      partySymbol: partySymbol || "",
    });

    res.status(201).json({
      message: "Candidate added successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL CANDIDATES
router.get("/", async (req, res) => {
  const candidates = await Candidate.find();
  res.json(candidates);
});
//results
router.get("/results", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    const totalVoters = await User.countDocuments({ role: "voter" });

    res.json({
      results: candidates,
      totalVoters,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE CANDIDATE (ADMIN)
router.delete("/:id", verifyAdmin, adminCheck, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;