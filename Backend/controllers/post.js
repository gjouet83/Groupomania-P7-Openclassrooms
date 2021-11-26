const db = require('../models/index');
const fs = require('fs');
const Sequelize = require('sequelize');

//on récupère tous les posts
exports.getAllPosts = (req, res, next) => {
  db.post
    .findAll({
      // jointure table user et like
      include: [
        {
          model: db.user,
          attributes: ['username', 'avatar'],
        },
        {
          model: db.like,
          attributes: ['like', 'dislike'],
        },
        {
          model: db.comment,
          attributes: ['postId'],
        },
      ],
      // ordre par date de la plus recente a la plus ancienne
      order: [['createdAt', 'DESC']],
    })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//on récupère les posts d'un user
exports.getPostByUser = (req, res, next) => {
  db.post
    .findAll({
      include: [
        {
          model: db.user,
          attributes: ['username', 'avatar'],
        },
      ],
      where: { userId: req.query.userId },
      // ordre par date de la plus recente a la plus ancienne
      order: [['createdAt', 'DESC']],
    })
    .then((posts) => {
      if (!posts) {
        return res.status(404).json({ error: 'posts non trouvé' });
      }
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//on crée un post
exports.createPost = (req, res, next) => {
  // on test si la requête contient un fichier
  const newPost = req.file
    ? {
        ...req.body,
        attachment: `${req.protocol}://${req.get('host')}/images/userId-${
          req.body.userId
        }/${req.file.filename}`,
      }
    : {
        ...req.body,
      };
  db.post
    .create({
      ...newPost,
    })
    .then(() => {
      res.status(201).json({ message: 'Post crée avec SUCCES !' });
    })
    .catch(() => {
      res.status(400).json({ error: 'ECHEC de la creation du post' });
    });
};

//on modifie un post
exports.updatePost = (req, res, next) => {
  const updatedPost = req.file
    ? {
        ...req.body,
        attachment: `${req.protocol}://${req.get('host')}/images/userId-${
          req.body.userId
        }/${req.file.filename}`,
      }
    : { ...req.body };
  db.post
    .update({ ...updatedPost }, { where: { id: req.query.id } })
    .then(() => {
      res.status(200).json({ message: 'Post modifié avec SUCCES !' });
    })
    .catch(() => {
      res.status(400).json({ error: 'ECHEC de la modification du post' });
    });
};

//on supprime le post d'un user
exports.deletePost = (req, res, next) => {
  db.post
    .findOne({ where: { id: req.query.id } })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: 'Post non trouvé' });
      }
      //on supprime le fichier
      if (post.attachment) {
        const filename = post.attachment.split(
          `images/userId-${req.body.userId}`
        )[1];
        fs.unlink(`images/userId-${req.body.userId}/${filename}`, () => {
          console.log('image supprimée');
        });
      }
      post
        .destroy()
        .then(() => {
          res.status(200).json({ message: 'Post supprimé avec SUCCES !' });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
