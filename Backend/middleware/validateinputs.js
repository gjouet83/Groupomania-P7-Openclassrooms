const { body, validationResult } = require('express-validator');

exports.email = [
  body('email')
    .not()
    .isEmpty()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('E-mail Invalide !')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.newEmail = [
  body('newEmail')
    .not()
    .isEmpty()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('E-mail Invalide !')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.content = [
  body('content')
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage('Caractères Invalides !'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
