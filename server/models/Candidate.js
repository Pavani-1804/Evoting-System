const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  party: {
    type: String,
    required: true,
  },

  votes: {
    type: Number,
    default: 0,
  },

  age: {
    type: Number,
  },

  education: {
    type: String,
  },

  experience: {
    type: String,
  },

  manifesto: {
    type: String,
  },

  photo: {
    type: String,
    default: "",
  },

  motto: {
    type: String,
    default: "",
  },

  partySymbol: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);