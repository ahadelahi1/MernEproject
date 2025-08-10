const express = require("express");
const router = express.Router();
const ExpoController = require("../Controllers/expoController");
const upload = require("../middlewares/upload"); // tumhara upload.js

router.post("/add", upload.single("image"), ExpoController.Create);
router.get("/all", ExpoController.GetAll);
router.get("/:id", ExpoController.GetOne);
router.put("/:id", upload.single("image"), ExpoController.Update);
router.delete("/:id", ExpoController.Delete);

module.exports = router;
