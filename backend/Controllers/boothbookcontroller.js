const Booth = require("../Models/Booth");
const BoothBooking = require("../Models/BoothSchema");

// POST /api/boothBookings/book
exports.bookBooth = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const { eventId, exhibitorId, boothIds, bookingDate, description } = req.body;

    if (!Array.isArray(boothIds) || boothIds.length === 0) {
      return res.status(400).json({ message: "No booths selected" });
    }

    let bookings = [];

    for (const boothId of boothIds) {
      const booth = await Booth.findById(boothId);
      if (!booth) continue;
      if (booth.availability === "booked") continue;

      const booking = new BoothBooking({
        eventId,
        exhibitorId,
        boothId,
        bookingDate,
        description,
        status: "booked",
      });
      await booking.save();

      booth.availability = "booked";
      await booth.save();

      bookings.push(booking);
    }

    res.status(201).json({
      message: "Booth(s) booked successfully",
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/boothBookings/:exhibitorId
exports.getBooking = async (req, res) => {
  try {
    const exhibitorId = req.params.exhibitorId; // ya req.user._id agar auth middleware use ho

    const bookings = await BoothBooking.find({ exhibitorId })
      .populate("eventId", "title date") // Event info
      .populate("boothId", "name location") // Booth info
      .populate("exhibitorId", "name email"); // Exhibitor info optional

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No booths booked yet" });
    }

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
