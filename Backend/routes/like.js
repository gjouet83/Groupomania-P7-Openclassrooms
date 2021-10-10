const express = require("express");
const likeCtrl = require("../controllers/like");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, likeCtrl.likePost);

module.exports = router;