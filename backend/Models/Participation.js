// models/Participation.js
const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema({
  exhibitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exhibitor",
    required: true,
  },
  booth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booth",
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["confirmed", "pending", "cancelled"],
    default: "confirmed",
  }
});

module.exports = mongoose.model("Participation", participationSchema);
