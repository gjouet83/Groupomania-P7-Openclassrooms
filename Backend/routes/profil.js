const express = require("express");
const profilCtrl = require("../controllers/profil");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

const router = express.Router();

router.get("/:id", auth, profilCtrl.getProfil);

router.post("/", auth, multer, profilCtrl.createProfil);
router.put("/:id", auth, multer, profilCtrl.updateProfil);
/*router.delete("/:id", auth, multer, profilCtrl.deleteProfil);*/

module.exports = router;