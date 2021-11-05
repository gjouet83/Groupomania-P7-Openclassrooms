const db = require('../models/index');
const fs = require('fs');

// regex pour la protection d'injection de code
const validFields = (field) => {
  return /^[\sa-zA-Z0-9ÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôöùû\.\(\)\[\]\"\'\-,;:\/!\?]+$/g.test(
    field
  );
};

exports.getComments = (req, res, next) => {
  console.log(req.query);
  db.comment
    .findAndCountAll({
      //jointure table users (username)
      include: [
        {
          model: db.user,
          attributes: ['username'],
        },
      ],
      where: { postId: req.query.postId },
      // ordre par date de la plus recente a la plus ancienne
      order: [['createdAt', 'DESC']],
    })
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getCommentByUser = (req, res, next) => {
  db.comment
    .findAll({
      include: [
        {
          model: db.user,
          attributes: ['username'],
        },
      ],
      where: { userId: req.query.userId },
    })
    .then((comments) => {
      if (!comments) {
        return res.status(404).json({ error: 'Commentaires non trouvé' });
      }
      res.status(200).json(comments);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.createComment = (req, res, next) => {
  if (!validFields(req.body.content)) {
    return res.status(406).json({ message: 'Caractères non autorisés' });
  }
  // on test si la requête contient un fichier
  const newComment = req.file
    ? {
        ...req.body,
        attachment: `${req.protocol}://${req.get('host')}/images/userId-${
          req.body.userId
        }/${req.file.filename}`,
      }
    : { ...req.body };
  db.comment
    .create({
      ...newComment,
    })
    .then(() => {
      res.status(201).json({ message: 'Commentaire crée avec SUCCES !' });
    })
    .catch(() => {
      res.status(400).json({ error: 'ECHEC de la creation du commentaire' });
    });
};

exports.updateComment = (req, res, next) => {
  if (!validFields(req.body.title)) {
    return res.status(406).json({ message: 'Caractères non autorisés' });
  }
  if (!validFields(req.body.content)) {
    return res.status(406).json({ message: 'Caractères non autorisés' });
  }
  //on test si la requête contient un fichier
  const updatedComment = req.file
    ? {
        ...req.body,
        attachment: `${req.protocol}://${req.get('host')}/images/userId-${
          req.body.userId
        }/${req.file.filename}`,
      }
    : { ...req.body };
  db.comment
    .findOne({ where: { id: req.params.id } })
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }
      comment
        .update({ ...updatedComment })
        .then(() => {
          res.status(200).json({
            message: 'Commentaire modifié avec SUCCES !',
          });
        })
        .catch(() => {
          res.status(400).json({
            error: 'ECHEC de la modification du post',
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.deleteComment = (req, res, next) => {
  db.comment
    .findOne({
      where: { id: req.query.id },
    })
    .then((comment) => {
      if (!comment) {
        return re.status(404).json({ error: 'Commentaire non trouvé' });
      }
      //on supprime le fichier
      if (comment.attachment) {
        const filename = comment.attachment.split(
          `images/userId-${req.body.userId}`
        )[1];
        fs.unlink(`images/userId-${req.body.userId}/${filename}`, () => {
          console.log('image supprimée');
        });
      }
      comment
        .destroy()
        .then(() => {
          res
            .status(200)
            .json({ message: 'Commentaire supprimé avec SUCCES !' });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
