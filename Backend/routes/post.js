const express = require('express');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-posts');

const router = express.Router();

router.get('/get', auth, postCtrl.getAllPosts);
router.get('/get/byUserId', auth, postCtrl.getPostByUser);
router.post('/create', auth, multer, postCtrl.createPost);
router.put('/update/:id', auth, multer, postCtrl.updatePost);
router.delete('/delete/:id', auth, postCtrl.deletePost);

module.exports = router;
