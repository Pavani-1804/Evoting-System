const dns = require('node:dns');
dns.setServers(['10.102.11.10', '8.8.8.8', '8.8.4.4']);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/api/candidates", candidateRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/feedback", feedbackRoutes);

// Connect to DB before starting server
connectDB().then(() => {
  app.use("/api/users", userRoutes);

  app.get("/", (req, res) => {
    res.send("Votexa Backend Running");
  });

  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to MongoDB. Server not started.", err);
});