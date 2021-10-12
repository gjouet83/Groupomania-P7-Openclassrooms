const express = require("express");
const commentCtrl = require("../controllers/comment");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-posts");

const router = express.Router();

router.get("/", auth, commentCtrl.getComments);
router.get("/:id", auth, commentCtrl.getOneComment);
router.post("/", auth, multer, commentCtrl.createComment);
router.put("/:id", auth, multer, commentCtrl.updateComment);
router.delete("/:id", auth, commentCtrl.deleteComment);

module.exports = router;