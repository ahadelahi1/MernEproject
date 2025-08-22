const express = require("express");
const router = express.Router();
const { bookBooth, getBooking } = require("../Controllers/boothbookcontroller");


// ✅ Book Booth (only exhibitor can book)
router.post("/bookBooth", bookBooth);
router.get("/bookBooth/:exhibitorId", getBooking);
module.exports = router;
