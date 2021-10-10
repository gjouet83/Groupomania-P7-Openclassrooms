const express = require("express");
const commentCtrl = require("../controllers/comment");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-posts");

const router = express.Router();

router.get("/", auth, commentCtrl.getComments);
router.post("/", auth, multer, commentCtrl.createComment);
router.put("/", auth, multer, commentCtrl.updateComment);
router.delete("/", auth, commentCtrl.deleteComment);

module.exports = router;