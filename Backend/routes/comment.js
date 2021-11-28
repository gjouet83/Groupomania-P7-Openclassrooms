const express = require('express');
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const validate = require('../middleware/validateinputs');
const multer = require('../middleware/multer-posts');

const router = express.Router();

router.get('/get', auth, commentCtrl.getComments);
router.get('/get/byUserId', auth, commentCtrl.getCommentByUser);
router.post(
  '/create',
  auth,
  multer,
  validate.content,
  commentCtrl.createComment
);
router.put(
  '/update/:id',
  auth,
  multer,
  validate.content,
  commentCtrl.updateComment
);
router.delete('/delete/:id', auth, commentCtrl.deleteComment);

module.exports = router;
