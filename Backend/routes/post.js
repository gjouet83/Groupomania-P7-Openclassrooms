const express = require('express');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const validate = require('../middleware/validateinputs');
const multer = require('../middleware/multer-posts');

const router = express.Router();

router.get('/get', auth, postCtrl.getAllPosts);
router.get('/get/byUserId', auth, postCtrl.getPostByUser);
router.post('/create', auth, multer, validate.content, postCtrl.createPost);
router.put('/update/:id', auth, multer, validate.content, postCtrl.updatePost);
router.delete('/delete/:id', auth, postCtrl.deletePost);

module.exports = router;
