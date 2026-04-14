const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [images] = await req.db.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { url, caption, alt } = req.body;
    
    const [result] = await req.db.query(
      'INSERT INTO gallery (url, caption, alt) VALUES (?, ?, ?)',
      [url, caption || '', alt || '']
    );

    const [newImage] = await req.db.query('SELECT * FROM gallery WHERE id = ?', [result.insertId]);
    res.status(201).json(newImage[0]);
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ message: 'Error creating gallery.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { caption, alt } = req.body;
    
    await req.db.query(
      'UPDATE gallery SET caption = ?, alt = ? WHERE id = ?',
      [caption || '', alt || '', req.params.id]
    );

    const [image] = await req.db.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    
    if (image.length === 0) {
      return res.status(404).json({ message: 'Image not found.' });
    }
    
    res.json(image[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Image not found.' });
    }
    
    res.json({ message: 'Image deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery.' });
  }
});

module.exports = router;
