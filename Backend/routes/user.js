const express = require('express');
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

const router = express.Router();

router.get('/get', auth, userCtrl.getAllUsers);
router.get('/get/:id', auth, userCtrl.getOneUser);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/update/login/:id', auth, multer, userCtrl.updateLogin);
router.put('/update/password/:id', auth, multer, userCtrl.updatePassword);
router.put('/update/:id', auth, multer, userCtrl.updateUser);
router.delete('/delete/:id', auth, userCtrl.deleteUser);

module.exports = router;
