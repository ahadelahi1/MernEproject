const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  rating: { type: Number, required: true }, // 1-5
  comment: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
