const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");

router.post("/login", adminController.login);
// router.post("/register", adminController.register); // Only once

module.exports = router;
