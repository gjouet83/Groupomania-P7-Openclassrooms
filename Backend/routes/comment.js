const express = require("express");
const commentCtrl = require("../controllers/comment");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-posts");

const router = express.Router();



module.exports = router;