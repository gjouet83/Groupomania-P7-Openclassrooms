const db = require('../models/index');

exports.getLikes = (req, res, next) => {
  db.like
    .findAndCountAll({ where: { postId: req.body.postId } })
    .then((likes) => {
      res.status(200).json(likes);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.createLike = (req, res, next) => {
  //on cherche si un like existe avec le postId et le userId
  db.like
    .findOne({ where: { postId: req.body.postId, userId: req.body.userId } })
    .then((like) => {
      // si il existe => fonction update en lui passant la requête et le like trouvé
      if (like) {
        updateLike(req, res, like);
        // sinon on crée le like en fonction de la valeur de like:
      } else {
        // si like= -1 alors c'est un dislike, si like= 1 alors c'est un like => on recopie juste la requête
        const likeOrDislike =
          req.body.like === -1
            ? {
                userId: req.body.userId,
                postId: req.body.postId,
                dislike: 1,
              }
            : { ...req.body };
        db.like
          .create({ ...likeOrDislike })
          .then(() => {
            res.status(200).json({ message: 'Like ajouté avec SUCCES !' });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

const updateLike = (req, res, postLikeStatus) => {
  if (req.body.like == 1) {
    if (postLikeStatus.like == 1 || postLikeStatus.dislike == 1) {
      return res
        .status(400)
        .json({ error: "Vous ne pouvez liker ou Disliker qu'une seule fois" });
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
          res.status(200).json({ message: 'Like ajouté avec SUCCES !' });
        })
        .catch(() => {
          res
            .status(400)
            .json({ error: 'Erreur lors de la mise a jour du like' });
        });
    }
  } else if (req.body.like == 0) {
    if (postLikeStatus.like == 1) {
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
          res.status(200).json({ message: 'Like retiré avec SUCCES !' });
        })
        .catch(() => {
          res
            .status(400)
            .json({ error: 'Erreur lors de la mise a jour du like' });
        });
    } else if (postLikeStatus.dislike == 1) {
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
          res.status(200).json({ message: 'Dislike retiré avec SUCCES !' });
        })
        .catch(() => {
          res
            .status(400)
            .json({ error: 'Erreur lors de la mise a jour du like' });
        });
    } else {
      return res
        .status(400)
        .json({ error: 'Erreur lors de la mise a jour du like' });
    }
  } else if (req.body.like == -1) {
    if (postLikeStatus.like == 1 || postLikeStatus.dislike == 1) {
      return res
        .status(400)
        .json({ error: "Vous ne pouvez liker ou Disliker qu'une seule fois" });
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
          res.status(200).json({ message: 'Dislike ajouté avec SUCCES !' });
        })
        .catch(() => {
          res
            .status(400)
            .json({ error: 'Erreur lors de la mise a jour du like' });
        });
    }
  } else {
    return res
      .status(400)
      .json({ error: 'Erreur lors de la mise a jour du like' });
  }
};
