const express = require("express");
const router = express.Router();
const { bookBooth } = require("../Controllers/boothbookcontroller");


// ✅ Book Booth (only exhibitor can book)
router.post("/bookBooth", bookBooth);

module.exports = router;
