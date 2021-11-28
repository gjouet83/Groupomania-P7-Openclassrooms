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

exports.username = [
  body('username')
    .isLength({ min: 2, max: 15 })
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

exports.profil = [
  body('username')
    .if(body('username').exists())
    .isLength({ min: 2, max: 15 })
    .trim()
    .escape()
    .isAlphanumeric('fr-FR', { ignore: ' -_' })
    .withMessage('Caractères invalides'),
  body('job')
    .if(body('job').exists())
    .isLength({ min: 3 })
    .trim()
    .escape()
    .isAlphanumeric('fr-FR', { ignore: ' -_' })
    .withMessage('Caractères invalides'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.password = [
  body('password').isLength({ min: 9 }).isAlphanumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.newPassword = [
  body('newPassword').isLength({ min: 9 }).isAlphanumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.content = [
  body('content').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
