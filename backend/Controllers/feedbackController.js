const Feedback = require("../Models/feedbackModel");

// Add Feedback
exports.addFeedback = async (req, res) => {
  try {
    const { user, stars, comment, event } = req.body;

    if (!user || !stars || !event) {
      return res.status(400).json({ message: "User, stars, and event are required" });
    }

    const feedback = new Feedback({
      user,
      stars,
      comment,
      event
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Error adding feedback", error });
  }
};

// Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .populate("event", "title location");
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks", error });
  }
};

// Get feedbacks by event
exports.getFeedbacksByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ event: eventId })
      .populate("user", "name email")
      .populate("event", "title location");
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event feedbacks", error });
  }
};

// Get feedbacks by user
exports.getFeedbacksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await Feedback.find({ user: userId })
      .populate("event", "title location");
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user feedbacks", error });
  }
};
