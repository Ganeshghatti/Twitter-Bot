const express = require("express");
const connectDatabase = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/Admin/Admin");
const twitterRoutes = require("./routes/Twitter/Twitter");
const linkedinRoutes = require("./routes/Linkedin/Linkedin");
const instagramRoutes = require("./routes/Instagram/Instagram");
const dotenv = require("dotenv");
const moment = require("moment");
const momentTimezone = require("moment-timezone");
const { cronPublishPosts } = require("./cron/cronPublishPosts");
const { cronTwitterPosts } = require("./cron/Twitter/cronTwitterPosts");
const axios = require('axios');

const envFile = process.env.SOCIAL_MEDIA_ENV;
dotenv.config({ path: envFile });

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(adminRoutes);
app.use(twitterRoutes);
app.use(linkedinRoutes);
app.use(instagramRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to The Squirrel backend");
});

connectDatabase();

momentTimezone.tz.setDefault("Asia/Kolkata");
console.log(moment());

// Start the server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
