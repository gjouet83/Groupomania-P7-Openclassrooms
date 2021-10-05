const db = require("../models/index");
const Profil = db.profil;
const fs = require("fs");
// regex pour la protection d'injection de code
const validFields = (field) => {
	return /^[\sa-zA-Z0-9ÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôöùû\.\(\)\[\]\"\'\-,;:\/!\?]+$/g.test(
		field
	);
};

exports.getProfil = (req, res, next) => {
	db.profil.findOne({ where: {userId : req.params.id}})
		.then((profil) => {
			res.status(200).json(profil);
		})
		.catch(() => {
			res.status(400).json({ error : "Profil introuvable" });
		});
};

exports.createProfil = (req, res, next) => {
    if (!validFields(req.body.name)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	if (!validFields(req.body.givenname)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
    /*const profilObj = req.file
    ? {
            ...JSON.parse(req.body),
            avatar: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
            }`,
      }
    : { ...req.body };*/
    const newProfil = new Profil({
        userId: req.query.id,
        ...req.body,
		avatar: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
    });
    newProfil.save({
    })
    .then(() => {
        res.status(201).json({ message: "Profil créé avec succès"});
    }).catch((err) => {
        const filename = req.query.id;
        fs.unlink(`Backend/images/userId-${filename}`,() => {
            res.status(400).json( err);
        });
    });
};

exports.updateProfil = (req, res, next) => {
    const updatedProfil = req.file
    ? {
            ...JSON.parse(req.body.profil),
            avatar: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
            }`,
      }
    : { ...req.body };
    if (!validFields(updatedProfil.name)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	if (!validFields(updatedProfil.givenname)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
    db.profil.update({...updatedProfil }, { where : { id: req.params.id} })
    .then(() => {
        res.status(200).json({ message:"Profil modifié avec SUCCES !"})
    }).catch(() => {
        res.status(400).json({ error:"ECHEC de la modification du profil"})
    })
};
