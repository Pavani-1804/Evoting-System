const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "voter" },
  hasVoted: { type: Boolean, default: false },
  otp: { type: String, default: "" },
  otpExpires: { type: Date },
  photo: { type: String, default: "" }
});

module.exports = mongoose.model("User", userSchema);