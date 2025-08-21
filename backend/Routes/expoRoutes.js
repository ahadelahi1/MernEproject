const express = require("express");
const router = express.Router();
const ExpoController = require("../Controllers/expoController");
const upload = require("../middlewares/upload"); // tumhara upload.js

router.post(
    "/add",
    (req, res, next) => {
      upload.single("image")(req, res, (err) => {
        if (err) {
          // Multer threw an error (e.g., invalid file type)
          return res.status(400).json({ msg: err.message });
        }
        next(); // go to controller if no error
      });
    },
    ExpoController.Create
  );
router.get("/all", ExpoController.GetAll);
router.get("/:id", ExpoController.GetOne);
router.put("/:id", upload.single("image"), ExpoController.Update);
router.delete("/:id", ExpoController.Delete);
router.get("/:id/details",ExpoController.getExpoDetails);

module.exports = router;
