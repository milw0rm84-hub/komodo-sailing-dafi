const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file.' });
  }
});

router.post('/images', auth, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const images = req.files.map(file => ({
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename
    }));

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files.' });
  }
});

module.exports = router;
