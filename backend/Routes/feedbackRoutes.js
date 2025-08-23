const express = require("express");
const router = express.Router();
const feedbackController = require("../Controllers/feedbackController");

// Routes
router.post("/add", feedbackController.addFeedback);
router.get("/all", feedbackController.getAllFeedbacks);
router.get("/event/:eventId", feedbackController.getFeedbacksByEvent);
router.get("/user/:userId", feedbackController.getFeedbacksByUser);

module.exports = router;
