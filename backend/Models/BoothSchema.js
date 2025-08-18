const mongoose = require("mongoose");


  // BoothBooking Model
  const BoothBookingSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo" },
    exhibitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Exhibitor" },
    boothId: { type: mongoose.Schema.Types.ObjectId, ref: "Booth" },
    status: { type: String, default: "booked" },
    bookedAt: { type: Date, default: Date.now },
  });
  const BoothBooking = mongoose.model("BoothBooking", BoothBookingSchema);
  module.exports = BoothBooking; 