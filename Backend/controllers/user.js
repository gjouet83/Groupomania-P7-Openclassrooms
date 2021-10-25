const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const CryptoJS = require('crypto-js');
const fs = require('fs');

//personnalisation de KEY et IV pour la comparaison lors du login
const key = CryptoJS.enc.Hex.parse(process.env.KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.IV);

// regex pour la protection d'injection de code
const validFields = (field) => {
  return /^[\sa-zA-Z0-9ÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôöùû\.\(\)\[\]\"\'\-,;:\/!\?]+$/g.test(
    field
  );
};

// regex pour la protection d'injection de code
const validEmail = (email) => {
  return /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(email);
};

const validPassword = (password) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}[^@&"()!_$*€£`+=\/;?#]+$/.test(
    password
  );
};

exports.signup = (req, res, next) => {
  //on teste les champs
  if (!validFields(req.body.username)) {
    return res.status(401).json({ error: 'Caractères non valide' });
  }
  if (!validEmail(req.body.email)) {
    return res.status(401).json({ error: 'Email non valide' });
  }
  if (!validPassword(req.body.password)) {
    return res.status(401).json({
      error:
        'Le mot de passe doit contenir au moins 8 caractères avec : une majuscule, une minuscule, un chiffre et ne doit pas contenir de caractères spéciaux',
    });
  }
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
        })
        .then(() => {
          res.status(201).json({ message: 'Utilisateur créé avec succès' });
        })
        .catch((error) => {
          res.status(400).json(error.errors[0].message);
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  //on teste les champs
  if (!validEmail(req.body.email)) {
    return res.status(401).json({ message: 'Email non valide' });
  }
  if (!validPassword(req.body.password)) {
    return res.status(401).json({
      message:
        'Le mot de passe doit contenir au moins 8 caractères avec : une majuscule, une minuscule, un chiffre et ne doit pas contenir de caractères spéciaux',
    });
  }
  //on cherche le user avec le même email crypté
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
      bcrypt
        //on compare le hash du password
        .compare(req.body.password, user.password)
        .then((passwordOk) => {
          if (!passwordOk) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
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
                { expiresIn: '24h' }
              ),
            });
          });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneUser = (req, res, next) => {
  db.user
    .findOne({ where: { id: req.body.userId } })
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

exports.updateUser = (req, res, next) => {
  if (!validFields(req.body.name)) {
    return res.status(406).json({ message: 'Caractères non autorisés' });
  }
  if (!validFields(req.body.givenname)) {
    return res.status(406).json({ message: 'Caractères non autorisés' });
  }
  //on teste si la requête possède un fichier ou non
  const updatedProfil = req.file
    ? {
        ...JSON.parse(req.body),
        avatar: `${req.protocol}://${req.get('host')}/images/userId-${
          req.body.userId
        }/${req.file.filename}`,
      }
    : {
        ...req.body,
        avatar: `${req.protocol}://${req.get('host')}/images/user-solid.svg`,
      };
  db.user
    .update({ ...updatedProfil }, { where: { id: req.body.userId } })
    .then(() => {
      res.status(200).json({ message: 'Profil modifié avec SUCCES !' });
    })
    .catch(() => {
      res.status(400).json({ error: 'ECHEC de la modification du profil' });
    });
};

exports.deleteUser = (req, res, next) => {
  db.user
    .findOne({ where: { id: req.body.userId } })
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
