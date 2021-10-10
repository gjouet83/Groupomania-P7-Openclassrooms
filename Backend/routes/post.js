const express = require("express");
const postCtrl = require("../controllers/post");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-posts");

const router = express.Router();

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/", auth, multer, postCtrl.updatePost);
router.delete("/", auth, postCtrl.deletePost);

module.exports = router;