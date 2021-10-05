const express = require("express");
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

const router = express.Router();

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/:id", auth, multer, userCtrl.updateProfil);
router.delete("/", userCtrl.deleteUser);

module.exports = router;