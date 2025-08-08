const express = require("express");
const router = express.Router();
const boothController = require("../Controllers/boothController");

router.post("/add", boothController.createBooth);
router.get("/all", boothController.getAllBooths);
router.get("/:id", boothController.getBoothById);
router.put("/:id", boothController.updateBooth);
router.delete("/:id", boothController.deleteBooth);

module.exports = router;
