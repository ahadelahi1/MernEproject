const mongoose = require("mongoose");

const exhibitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "active", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model("Exhibitor", exhibitorSchema);
