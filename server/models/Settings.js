const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Votexa Student Council Election",
  },
  description: {
    type: String,
    default: "Secure, digital, and transparent e-voting system.",
  },
  startDate: {
    type: Date,
    default: () => new Date(),
  },
  endDate: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // default 24h
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
