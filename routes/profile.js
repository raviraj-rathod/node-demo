const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true);
  else
    cb(null, false);
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter
});

router.get('/', (req, res) => {
  res.json({
    image:'http://localhost:8000/images/shoe/shoe.gltf'
  })
  // res.send('profile Get success Fully');
});

router.post('/single-pic', upload.single('singleImage'), (req, res) => {
  console.log(req.file);

  res.send('profile added success Fully');
});

module.exports = router;