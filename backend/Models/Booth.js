const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema({
  stallNumber: { type: String, required: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  hall: { type: mongoose.Schema.Types.ObjectId, ref: "Hall", required: true },
  availability: { type: String, default: "Available" },
});

module.exports = mongoose.model("Booth", boothSchema);
