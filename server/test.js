const mongoose = require("mongoose");
const dns = require('node:dns');
dns.setServers(['10.102.11.10', '8.8.8.8', '8.8.4.4']);
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected Successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Connection Failed:");
    console.log(err);
    process.exit(1);
  });