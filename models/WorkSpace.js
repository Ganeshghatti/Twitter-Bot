const mongoose = require("mongoose");

const workSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  connectedAccounts: [
    {
      type: {
        type: String,
        required: true,
      },
      credentials: Object,
      isConnected: {
        type: Boolean,
        default: false,
      },
    },
  ],
  icon: {
    type: String,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  settings: {
    description: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  createdAt: {
    type: String,
    required: true,
  },
});

const WorkSpace = mongoose.model("WorkSpace", workSpaceSchema);

module.exports = WorkSpace;