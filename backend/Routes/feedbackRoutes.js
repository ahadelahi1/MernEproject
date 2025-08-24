const express = require("express");
const router = express.Router();
const {
  addFeedback,
  getFeedbackByEvent,
  getMyFeedback,
  getPopularExpos
} = require("../Controllers/feedbackController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create feedback (login required)
router.post("/", authMiddleware, addFeedback);

// Get all feedbacks (explicit)
router.get("/all", getFeedbackByEvent);

// Popular expos
router.get("/expos/popular", getPopularExpos);

// My feedbacks
router.get("/me", authMiddleware, getMyFeedback);

// Get feedbacks by event id (param) - route last to avoid overriding static routes
router.get("/:eventId", getFeedbackByEvent);

module.exports = router;
