
const express = require("express");
const router = express.Router();
const all = require("../Controllers/usercontroller");
router.post("/register", all.Register);
router.post("/login" ,all.Login);
router.post("/forgot",all.forget_password);
router.put("/reset/:token",all.reset_password)



module.exports = router;