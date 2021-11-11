const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //on récupère le token a droite de bearer dans le header authorization
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    //on récupère le userId de l'object décodedToken et on le test dans le if
    const userId = decodedToken.userId;
    const admin = decodedToken.admin;

    if (req.body.userId && req.body.userId !== userId && !admin) {
      res.status(403).json({ error: 'Utilisateur non autorisé' });
    } else {
      next();
    }
  } catch {
    res.status(403).json({ error: 'Utilisateur non autorisé' });
  }
};
