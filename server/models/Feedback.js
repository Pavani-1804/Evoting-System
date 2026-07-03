const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous Voter" },
  message: { type: String, required: true },
  rating: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
