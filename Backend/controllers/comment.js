const db = require("../models/index");
const fs = require("fs");

// regex pour la protection d'injection de code
const validFields = (field) => {
	return /^[\sa-zA-Z0-9ÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôöùû\.\(\)\[\]\"\'\-,;:\/!\?]+$/g.test(
		field
	);
};

exports.getComments = (req, res, next) => {
	db.comment.findAndCountAll({
            include:[{
                model: db.user,
                attributes: ['username']
            }],
			where: { postId: req.body.postId },
			order: [["createdAt", "DESC"]],
		})
		.then((comments) => {
			res.status(200).json(comments);
		})
		.catch(() => {
			res.status(500).json({ error: "DataBase Error" });
		});
};

exports.getOneComment = (req, res, next) => {
	db.comment.findOne({ where: { id: req.params.id } })
		.then((comment) => {
			if (!comment) {
				return res.status(404).json({ error: "Commentaire non trouvé" });
			}
			res.status(200).json(comment);
		})
		.catch(() => {
			res.status(500).json({ error: "DataBase Error" });
		});
};

exports.createComment = (req, res, next) => {
	if (!validFields(req.body.content)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	const newComment = req.file
		? {
				...req.body,
				attachment: `${req.protocol}://${req.get("host")}/images/userId-${req.body.userId}/${
					req.file.filename
				}`,
		  }
		: {
				...req.body,
		  };
	db.comment.create({
			...newComment,
		})
		.then(() => {
			res.status(201).json({ message: "Commentaire crée avec SUCCES !" });
		})
		.catch(() => {
			res.status(400).json({ error: "ECHEC de la creation du commentaire" });
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
				attachment: `${req.protocol}://${req.get("host")}/images/userId-${req.body.userId}/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	db.comment.findOne({ where: { id: req.params.id } })
		.then((comment) => {
			if (!comment) {
				return res.status(404).json({ error: "Commentaire non trouvé" });
			}
			comment.update({ ...updatedComment })
				.then(() => {
					res.status(200).json({ message: "Commentaire modifié avec SUCCES !"});
				})
				.catch(() => {
					res.status(400).json({ error: "ECHEC de la modification du post"});
				});
		})
		.catch(() => {
			res.status(500).json({ error: "DataBase Error"});
		});
};

exports.deleteComment = (req, res, next) => {
	db.comment.findOne({
			where: { id: req.params.id },
		})
		.then((comment) => {
			if (!comment) {
				return re.status(404).json({ error: "Commentaire non trouvé" });
			}
			//on supprime le fichier
			if (comment.attachment) {
				const filename = comment.attachment.split(`images/userId-${req.body.userId}`)[1];
				fs.unlink(`images/userId-${req.body.userId}/${filename}`, () => {
					console.log("image supprimée");
				});
			}
			comment.destroy()
				.then(() => {
					res.status(200).json({ message: "Commentaire supprimé avec SUCCES !" });
				})
				.catch((error) => {
					res.status(400).json({ error });
				});
		})
		.catch(() => {
			res.status(500).json({ error: "DataBase Error" });
		});
};
