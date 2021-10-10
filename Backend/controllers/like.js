const db = require("../models/index");

exports.likePost = (req, res, next) => {
	db.like
		.findOne({
			where: { userId: req.body.userId, postId: req.body.postId },
		})
		.then((post) => {
			if (!post) {
				db.like.create({
					userId: req.body.userId,
					postId: req.body.postId,
					like: 0,
					dislike: 0,
				});
			}
			if (req.body.like == 1) {
				if (post.like == 1 || post.dislike == 1) {
					return res.status(400).json({
						error: "Vous ne pouvez liker ou Disliker qu'une seule fois",
					});
				} else {
					/*on incremente like de 1*/
					db.like
						.update(
							{ like: 1 },
							{
								where: {
									userId: req.body.userId,
									postId: req.body.postId,
								},
							}
						)
						.then(() => {
							res.status(200).json({
								message: "Like ajouté avec SUCCES !",
							});
						})
						.catch(() => {
							res.status(400).json({
								error: "Erreur lors de la mise a jour du like",
							});
						});
				}
			} else if (req.body.like == 0) {
				if (post.like == 1) {
					/*on decremente like de 1*/
					db.like
						.update(
							{ like: 0 },
							{
								where: {
									userId: req.body.userId,
									postId: req.body.postId,
								},
							}
						)
						.then(() => {
							res.status(200).json({
								message: "Like retiré avec SUCCES !",
							});
						})
						.catch(() => {
							res.status(400).json({
								error: "Erreur lors de la mise a jour du like",
							});
						});
				} else if (post.dislike == 1) {
					/*on decremente dislike de 1*/
					db.like
						.update(
							{ dislike: 0 },
							{
								where: {
									userId: req.body.userId,
									postId: req.body.postId,
								},
							}
						)
						.then(() => {
							res.status(200).json({
								message: "Dislike retiré avec SUCCES !",
							});
						})
						.catch(() => {
							res.status(400).json({
								error: "Erreur lors de la mise a jour du like",
							});
						});
				} else {
					return res.status(400).json({
						error: "Erreur lors de la mise a jour du like",
					});
				}
			} else if (req.body.like == -1) {
				if (post.like == 1 || post.dislike == 1) {
					return res.status(400).json({
						error: "Vous ne pouvez liker ou Disliker qu'une seule fois",
					});
				} else {
					/*on incremente dislike de 1*/
					db.like
						.update(
							{ dislike: 1 },
							{
								where: {
									userId: req.body.userId,
									postId: req.body.postId,
								},
							}
						)
						.then(() => {
							res.status(200).json({
								message: "Dislike ajouté avec SUCCES !",
							});
						})
						.catch(() => {
							res.status(400).json({
								error: "Erreur lors de la mise a jour du like",
							});
						});
				}
			} else {
				return res
					.status(400)
					.json({ error: "Erreur lors de la mise a jour du like" });
			}
		})
		.catch(() => {
			res.status(400).json({ error: "Utilisateur ou Post non trouvé !" });
		});
};
