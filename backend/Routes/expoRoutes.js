const express = require("express");
const router = express.Router();
const ExpoController = require("../Controllers/expoController");


router.post("/add", ExpoController.Create);
router.get("/all", ExpoController.GetAll);
router.get("/single/:id", ExpoController.GetOne);
router.put("/update/:id", ExpoController.Update);
router.delete("/delete/:id", ExpoController.Delete);




module.exports = router;
