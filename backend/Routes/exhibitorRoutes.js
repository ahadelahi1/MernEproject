const express = require("express");
const router = express.Router();
const exhibitorController = require("../Controllers/exhibitorController");

router.post("/exhibitorreg", exhibitorController.registerExhibitor);
router.post("/exhibitorlogin/", exhibitorController.loginExhibitor);
router.get("/booking", exhibitorController.getAllExhibitors);
router.get("/exhibitordashboard", exhibitorController.getAllExhibitors);
router.get("/exhibitorprofile", exhibitorController.getAllExhibitors);
router.post("/:id/status", exhibitorController.updateExhibitorStatus);

router.get("/", exhibitorController.getAllExhibitors);

router.put("/:id/status", exhibitorController.updateExhibitorStatus);
router.get("/:exhibitorId/dashboard", exhibitorController.getDashboardData);
router.put("/:exhibitorId", exhibitorController.updateExhibitor);



module.exports = router;
