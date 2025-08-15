const express = require("express");
const router = express.Router();
const boothController = require("../Controllers/boothController");
const Hall = require("../Models/Hall")
const Booth = require("../Models/Booth")


router.post("/add", boothController.createBooth);
router.get("/all", boothController.getAllBooths);
router.get("/:id", boothController.getBoothById);
router.put("/:id", boothController.updateBooth);
router.delete("/:id", boothController.deleteBooth);
// boothRoutes.js
router.get("/by-expo/:expoId", async (req, res) => {
    try {
      const halls = await Hall.find({ expoId: req.params.expoId });
      const hallIds = halls.map(h => h._id);
  
      const booths = await Booth.find({ hall: { $in: hallIds } });
      res.json(booths);
    } catch (err) {
      res.status(500).json({ message: "Error fetching booths" });
    }
  });
  
  
module.exports = router;
