const db = require("../models/index");
const fs = require("fs");

// regex pour la protection d'injection de code
const validFields = (field) => {
	return /^[\sa-zA-Z0-9ÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôöùû\.\(\)\[\]\"\'\-,;:\/!\?]+$/g.test(
		field
	);
};

exports.getAllPosts = (req, res, next) => {
	db.post
		.findAll({ order: [["createdAt", "DESC"]] })
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
};

exports.createPost = (req, res, next) => {
	if (!validFields(req.body.title)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	if (!validFields(req.body.content)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	const newPost = req.file
		? {
				...req.body,
				attachment: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: {
				...req.body,
		  };
	db.post
		.create({
			...newPost,
		})
		.then(() => {
			res.status(201).json({ message: "Post crée avec SUCCES !" });
		})
		.catch(() => {
			res.status(400).json({ error: "ECHEC de la creation du post" });
		});
};

exports.updatePost = (req, res, next) => {
	if (!validFields(req.body.title)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	if (!validFields(req.body.content)) {
		return res.status(406).json({ message: "Caractères non autorisés" });
	}
	const updatedPost = req.file
		? {
				...req.body,
				attachment: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	db.post
		.findOne({ where: { userId: req.body.userId, id: req.body.id } })
		.then((post) => {
			post.update({ ...updatedPost })
				.then(() => {
					res.status(200).json({
						message: "Post modifié avec SUCCES !",
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
				error: "Utilisateur non autorisé ou post inexistant",
			});
		});
};

exports.deletePost = (req, res, next) => {
	db.post
		.findOne({ where: { id: req.body.id, userId: req.body.userId } })
		.then((post) => {
            if (!post) {
                throw err;
            }
			//on supprime le fichier
			if (post.attachement) {
				const filename = post.attachment.split("images/")[1];
				fs.unlink(`images/${filename}`, () => {
					console.log("image supprimée");
				});
			}
			post
				.destroy()
				.then(() => {
					res.status(200).json({
						message: "Post supprimé avec SUCCES !",
					});
				})
				.catch((error) => {
					res.status(400).json({ error });
				});
		})
		.catch(() => {
			res.status(500).json({ error: "Le post n'existe pas" });
		});
};
