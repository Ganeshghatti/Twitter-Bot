const mongoose = require("mongoose");

const twitterPostsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "scheduled", "published"],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  tobePublishedAt: {
    type: Date,
  },
});

const TwitterPosts = mongoose.model("TwitterPosts", twitterPostsSchema);

module.exports = TwitterPosts;
