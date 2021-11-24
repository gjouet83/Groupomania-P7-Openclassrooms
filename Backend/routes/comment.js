const express = require('express');
const { check } = require('express-validator/check');
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-posts');

const router = express.Router();

router.get('/get', auth, commentCtrl.getComments);
router.get('/get/byUserId', auth, commentCtrl.getCommentByUser);
router.post(
  '/create',
  auth,
  [check('content').escape()],
  multer,
  commentCtrl.createComment
);
router.put(
  '/update/:id',
  auth,
  [check('content').escape()],
  multer,
  commentCtrl.updateComment
);
router.delete('/delete/:id', auth, commentCtrl.deleteComment);

module.exports = router;
