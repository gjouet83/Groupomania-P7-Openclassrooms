const express = require('express');
const likeCtrl = require('../controllers/like');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/get/', auth, likeCtrl.getLikes);
router.get('/get/user', auth, likeCtrl.getLikesByUser);
router.post('/create', auth, likeCtrl.createLike);

module.exports = router;
