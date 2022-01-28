const express = require('express');
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const validate = require('../middleware/validateinputs');
const multer = require('../middleware/multer');

const router = express.Router();

router.get('/get', auth, userCtrl.getAllUsers);
router.get('/get/:id', auth, userCtrl.getOneUser);
router.post(
  '/signup',
  validate.email,
  validate.username,
  validate.password,
  userCtrl.signup
);
router.post('/login', validate.email, validate.password, userCtrl.login);
router.put(
  '/update/login/:id',
  auth,
  validate.email,
  validate.newEmail,
  userCtrl.updateLogin
);
router.put(
  '/update/password/:id',
  auth,
  validate.password,
  validate.newPassword,
  userCtrl.updatePassword
);
router.put('/update/:id', auth, multer, validate.profil, userCtrl.updateUser);
router.put('/delete/profilimage/:id', auth, multer, userCtrl.deleteProfilImage);
router.delete('/delete/:id', auth, userCtrl.deleteUser);

module.exports = router;
