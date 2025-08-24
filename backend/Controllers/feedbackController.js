const Feedback = require('../Models/feedbackModel');
const Expo = require('../Models/Expo');

// ✅ Add feedback (1 feedback per user per expo allowed)
exports.addFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if already submitted
    const existing = await Feedback.findOne({ eventId, userId });
    if (existing) {
      return res.status(400).json({ message: "Feedback already submitted for this event" });
    }

    const feedback = new Feedback({
      userId,
      eventId,
      rating,
      comment,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (err) {
    res.status(500).json({ message: "Error adding feedback", error: err.message });
  }
};

// ✅ Get feedback by event (or all feedback if 'all')
exports.getFeedbackByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (eventId === "all") {
      const feedbacks = await Feedback.find().populate("userId", "name email");
      return res.json(feedbacks);
    }

    const feedbacks = await Feedback.find({ eventId }).populate("userId", "name email");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback", error: err.message });
  }
};

// ✅ Get feedbacks of current user
exports.getMyFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedbacks = await Feedback.find({ userId }).populate("eventId", "title location");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your feedbacks", error: err.message });
  }
};

// ✅ Get popular expos (average rating >= 4)
exports.getPopularExpos = async (req, res) => {
  try {
    const popular = await Feedback.aggregate([
      {
        $group: {
          _id: "$eventId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          avgRating: { $gte: 4 },
        },
      },
      {
        $lookup: {
          from: "expos",
          localField: "_id",
          foreignField: "_id",
          as: "expo",
        },
      },
      { $unwind: "$expo" },
    ]);

    res.json(popular);
  } catch (err) {
    res.status(500).json({ message: "Error fetching popular expos", error: err.message });
  }
};
