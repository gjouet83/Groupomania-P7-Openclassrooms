const express = require('express');
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-posts');

const router = express.Router();

router.get('/get', auth, commentCtrl.getComments);
router.get('/get/byUserId', auth, commentCtrl.getCommentByUser);
router.post('/create', auth, multer, commentCtrl.createComment);
router.put('/update/commentId:id', auth, multer, commentCtrl.updateComment);
router.delete('/delete/commentId:id', auth, commentCtrl.deleteComment);

module.exports = router;
