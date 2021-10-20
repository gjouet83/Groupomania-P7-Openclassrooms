const express = require('express');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-posts');

const router = express.Router();

router.get('/get', auth, postCtrl.getAllPosts);
router.post('/create', auth, multer, postCtrl.createPost);
router.put('/update/postId:id', auth, multer, postCtrl.updatePost);
router.delete('/delete/postId:id', auth, postCtrl.deletePost);

module.exports = router;
