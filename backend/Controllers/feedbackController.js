// controllers/feedbackController.js
const Feedback = require("../Models/feedbackModel"); // adjust path if needed
const mongoose = require("mongoose");

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

exports.addFeedback = async (req, res) => {
  try {
    const { rating, comment, event } = req.body;
    const userId = req.user?.id || req.user?._id; // accept either

    // validations
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!event) return res.status(400).json({ message: "Event id is required" });
    const parsedRating = safeNumber(rating);
    if (parsedRating == null || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    // prevent duplicate feedback from same user for same event
    // (assumes your Feedback schema has fields `user` and `event` as ObjectId refs)
    const already = await Feedback.findOne({ user: userId, event });
    if (already) {
      return res.status(409).json({ message: "You have already submitted feedback for this event" });
    }

    const fb = new Feedback({
      user: mongoose.Types.ObjectId(userId),
      event: mongoose.Types.ObjectId(event),
      rating: parsedRating,
      comment: comment || ""
    });

    await fb.save();
    // respond with created feedback (populated)
    const populated = await fb.populate("user", "name email").populate("event", "title location startDate endDate").execPopulate?.() ?? await Feedback.findById(fb._id).populate("user", "name email").populate("event", "title location startDate endDate");

    return res.status(201).json({ message: "Feedback submitted successfully", feedback: populated });
  } catch (err) {
    console.error("addFeedback error:", err);
    return res.status(500).json({ message: "Server error adding feedback", error: err.message });
  }
};

exports.getFeedbackByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // If explicit 'all' route is used, return everything
    if (eventId === "all") {
      const feedbacks = await Feedback.find({})
        .populate("user", "name email")
        .populate("event", "title location startDate endDate");
      return res.json(feedbacks);
    }

    // If eventId provided, validate it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const feedbacks = await Feedback.find({ event: eventId })
      .populate("user", "name email")
      .populate("event", "title location startDate endDate");

    return res.json(feedbacks);
  } catch (err) {
    console.error("getFeedbackByEvent error:", err);
    return res.status(500).json({ message: "Server error fetching feedback", error: err.message });
  }
};

// returns current user's feedbacks
exports.getMyFeedback = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const feedbacks = await Feedback.find({ user: userId })
      .populate("event", "title location startDate endDate")
      .populate("user", "name email");

    return res.json(feedbacks);
  } catch (err) {
    console.error("getMyFeedback error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// aggregate popular expos (avg rating >= 4)
exports.getPopularExpos = async (req, res) => {
  try {
    const agg = await Feedback.aggregate([
      {
        $group: {
          _id: "$event",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      },
      {
        $match: { avgRating: { $gte: 4 } }
      },
      {
        $lookup: {
          from: "expos", // collection name — ensure it's correct (lowercase plural of your model)
          localField: "_id",
          foreignField: "_id",
          as: "expo"
        }
      },
      { $unwind: "$expo" },
      {
        $project: {
          _id: "$expo._id",
          title: "$expo.title",
          location: "$expo.location",
          startDate: "$expo.startDate",
          endDate: "$expo.endDate",
          avgRating: 1,
          count: 1
        }
      }
    ]);

    return res.json(agg);
  } catch (err) {
    console.error("getPopularExpos error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
