const express = require("express");
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

const router = express.Router();

router.get("/get/userId:id", auth, userCtrl.getOneUser);
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/update/userId:id", auth, multer, userCtrl.updateUser);
router.delete("/delete/userId:id", auth, userCtrl.deleteUser);

module.exports = router;