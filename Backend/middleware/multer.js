const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg': 'svg',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `images/userId-${req.query.userId}`);
  },
  filename: (req, file, callback) => {
    console.log(req.query);
    console.log(file);
    //on crée l'extension grace au mimetypes
    const extension = MIME_TYPES[file.mimetype];
    //on crée un nom de fichier constitué de la date et de l'extention
    callback(null, 'userId-' + req.query.userId + 'avatar' + '.' + extension);
  },
});

module.exports = multer({ storage: storage }).single('image');
