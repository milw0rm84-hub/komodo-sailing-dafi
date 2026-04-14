const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const formatReview = (review) => ({
  id: review.id,
  name: review.name,
  email: review.email,
  rating: review.rating,
  comment: review.comment,
  packageId: review.package_id,
  packageName: review.package_name,
  status: review.status,
  createdAt: review.created_at
});

router.get('/', async (req, res) => {
  try {
    const { status, packageId, sort = 'created_at DESC' } = req.query;
    
    let query = 'SELECT * FROM reviews WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (packageId) {
      query += ' AND package_id = ?';
      params.push(packageId);
    }

    query += ` ORDER BY ${sort}`;

    const [reviews] = await req.db.query(query, params);
    res.json(reviews.map(formatReview));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.' });
  }
});

router.get('/approved', async (req, res) => {
  try {
    const [reviews] = await req.db.query('SELECT * FROM reviews WHERE status = "approved" ORDER BY created_at DESC');
    res.json(reviews.map(formatReview));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, rating, comment, packageId, packageName } = req.body;
    
    const [result] = await req.db.query(
      `INSERT INTO reviews (name, email, rating, comment, package_id, package_name, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [name, email, rating, comment, packageId, packageName]
    );

    const [newReview] = await req.db.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    res.status(201).json(formatReview(newReview[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error creating review.' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const [result] = await req.db.query('UPDATE reviews SET status = ? WHERE id = ?', [status, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    
    const [updatedReview] = await req.db.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    res.json(formatReview(updatedReview[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error updating review.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    
    res.json({ message: 'Review deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review.' });
  }
});

module.exports = router;
