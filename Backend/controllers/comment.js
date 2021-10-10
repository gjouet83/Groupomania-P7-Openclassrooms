const db = require("../models/index");
const fs = require("fs");

// regex pour la protection d'injection de code
const validFields = (field) => {
	return /^[\sa-zA-Z0-9ÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôöùû\.\(\)\[\]\"\'\-,;:\/!\?]+$/g.test(
		field
	);
};

exports.getComments = (req, res, next) => {
	db.comment
		.findAll({ 
            where: { postId: req.body.postId },
            order: [
                ["createdAt", "DESC"]
            ]
        })
		.then((comments) => {
			res.status(200).json(comments);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
};

exports.createComment = (req, res, next) => {
	if (!validFields(req.body.content)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	const newComment = req.file
		? {
				...req.body,
				attachment: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: {
				...req.body,
		  };
	db.comment
		.create({
			...newComment,
		})
		.then(() => {
			res.status(201).json({ message: "Commentaire crée avec SUCCES !" });
		})
		.catch(() => {
			res.status(400).json({
				error: "ECHEC de la creation du commentaire",
			});
		});
};

exports.updateComment = (req, res, next) => {
	if (!validFields(req.body.title)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	if (!validFields(req.body.content)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	const updatedComment = req.file
		? {
				...req.body,
				attachment: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	db.comment
		.findOne({ where: { userId: req.body.userId, id: req.body.id } })
		.then((comment) => {
			comment.update({ ...updatedComment })
				.then(() => {
					res.status(200).json({
						message: "Commentaire modifié avec SUCCES !",
					});
				})
				.catch(() => {
					res.status(400).json({
						error: "ECHEC de la modification du post",
					});
				});
		})
		.catch(() => {
			res.status(400).json({
				error: "Utilisateur non autorisé ou commentaire inexistant",
			});
		});
};

exports.deleteComment = (req, res, next) => {
	db.comment
		.findOne({
			where: { userId: req.body.userId, id: req.body.id },
		})
		.then((comment) => {
			if (!comment) {
                throw err;
            }
			//on supprime le fichier
            if (comment.attachment) {
                const filename = comment.attachment.split("images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    console.log("image supprimée");
                });
            }
			comment
				.destroy()
				.then(() => {
					res.status(200).json({
						message: "Commentaire supprimé avec SUCCES !",
					});
				})
				.catch((error) => {
					res.status(400).json({ error });
				});
		})
		.catch(() => {
			res.status(500).json({ error: "Le commentaire n'existe pas" });
		});
};
