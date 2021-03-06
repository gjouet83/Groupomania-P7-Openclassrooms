const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const CryptoJS = require('crypto-js');
const fs = require('fs');

//personnalisation de KEY et IV pour la comparaison lors du login
const key = CryptoJS.enc.Hex.parse(process.env.KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.IV);

exports.signup = (req, res, next) => {
  bcrypt
    // on hash le mot de passe
    .hash(req.body.password, 10)
    .then((hash) => {
      //on crée un user en cryptant le mail et en ajoutant le hash
      db.user
        .create({
          username: req.body.username,
          email: CryptoJS.AES.encrypt(req.body.email, key, {
            iv: iv,
          }).toString(),
          password: hash,
          avatar: `${req.protocol}://${req.get('host')}/images/user-solid.svg`,
          job: 'Non communiqué',
        })
        .then(() => {
          res.status(201).json({ message: 'Utilisateur créé avec succès' });
        })
        .catch((error) => {
          res
            .status(400)
            .json({ errno: error.parent.errno, errField: error.fields });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  //on cherche le user avec le même email crypté
  db.user
    .findOne({
      where: {
        email: CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString(),
      },
    })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ errorMail: 'Utilisateur non enregistré' });
      }
      bcrypt
        //on compare le hash du password
        .compare(req.body.password, user.password)
        .then((passwordOk) => {
          if (!passwordOk) {
            return res
              .status(401)
              .json({ errorPassword: 'Mot de passe incorrect' });
          }
          // creation d'un dossier user contenant touts ses photos
          const filename = 'userId-' + user.id;
          fs.mkdir(`images/${filename}`, () => {
            res.status(200).json({
              userId: user.id,
              admin: user.admin,
              // on crée un token contenant le userId et admin (true, false)
              token: jwt.sign(
                { userId: user.id, admin: user.admin },
                process.env.USER_TOKEN,
                { expiresIn: '12h' }
              ),
            });
          });
        })
        .catch((error) => {
          res
            .status(400)
            .json({ errno: error.parent.errno, errField: error.fields });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//on récupère un utilisateur
exports.getOneUser = (req, res, next) => {
  db.user
    .findOne({ where: { id: req.query.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ user });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//on récupère tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
  db.user
    .findAll()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//mise a jour du login
exports.updateLogin = (req, res, next) => {
  db.user
    .findOne({
      where: {
        email: CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString(),
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non enregistré' });
      }
      db.user
        .update(
          {
            email: CryptoJS.AES.encrypt(req.body.newEmail, key, {
              iv: iv,
            }).toString(),
          },
          { where: { id: req.body.userId } }
        )
        .then(() => {
          res.status(200).json({ message: 'Email modifié avec SUCCES !' });
        })
        .catch((error) => {
          res
            .status(400)
            .json({ errno: error.parent.errno, errField: error.fields });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// mise a jour du password
exports.updatePassword = (req, res, next) => {
  db.user
    .findOne({ where: { id: req.body.userId } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non enregistré' });
      }
      bcrypt
        //on compare le hash du password
        .compare(req.body.password, user.password)
        .then((passwordOk) => {
          if (!passwordOk) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
          }
          bcrypt
            // on hash le mot de passe
            .hash(req.body.newPassword, 10)
            .then((hash) => {
              db.user
                .update(
                  {
                    password: hash,
                  },
                  { where: { id: req.body.userId } }
                )
                .then(() => {
                  res
                    .status(200)
                    .json({ message: 'Password modifié avec succès' });
                });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//mise a jour des info user
exports.updateUser = (req, res, next) => {
  //on teste si la requête possède un fichier ou non
  const updatedProfil = req.file
    ? {
        ...req.body,
        avatar: `${req.protocol}://${req.get('host')}/images/userId-${
          req.body.userId
        }/${req.file.filename}`,
      }
    : {
        ...req.body,
      };
  db.user
    .update({ ...updatedProfil }, { where: { id: req.body.userId } })
    .then(() => {
      res.status(200).json({ message: 'Profil modifié avec SUCCES !' });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ errno: error.parent.errno, errField: error.fields });
    });
};

exports.deleteProfilImage = (req, res, next) => {
  db.user
    .update(
      { avatar: `${req.protocol}://${req.get('host')}/images/user-solid.svg` },
      { where: { id: req.body.userId } }
    )
    .then(() => {
      res.status(200).json({ message: 'Profil modifié avec SUCCES !' });
    })
    .catch(() => {
      res.status(400).json({ error: 'ECHEC de la modification du profil' });
    });
};

//on supprime un utilisateur
exports.deleteUser = (req, res, next) => {
  db.user
    .findOne({ where: { id: req.query.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      //on supprime le dossier du user correspondant
      const filename = 'userId-' + user.id;
      fs.rmdir(`images/${filename}`, { recursive: true }, () => {
        user
          .destroy()
          .then(() => {
            res.status(200).json({ message: 'Compte supprimé avec SUCCES !' });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
