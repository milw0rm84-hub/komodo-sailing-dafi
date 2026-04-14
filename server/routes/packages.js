const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { featured, status, search, sort = 'created_at DESC' } = req.query;
    
    let query = 'SELECT * FROM packages WHERE 1=1';
    const params = [];
    
    if (featured !== undefined) {
      query += ' AND featured = ?';
      params.push(featured === 'true');
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY ${sort}`;

    const [rows] = await req.db.query(query, params);
    
    const formattedPackages = rows.map(pkg => ({
      ...pkg,
      itinerary: typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]') : pkg.itinerary,
      gallery: typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery || '[]') : pkg.gallery
    }));

    res.json(formattedPackages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Error fetching packages.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching package with id:', id);
    
    let query, params;
    
    if (isNaN(id)) {
      console.log('Using slug query');
      query = 'SELECT * FROM packages WHERE slug = ?';
      params = [id];
    } else {
      console.log('Using numeric id query');
      query = 'SELECT * FROM packages WHERE id = ?';
      params = [parseInt(id)];
    }
    
    const [rows] = await req.db.query(query, params);
    console.log('Query result:', rows.length, 'packages found');
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Package not found.' });
    }
    
    const pkg = rows[0];
    pkg.itinerary = typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]') : pkg.itinerary;
    pkg.gallery = typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery || '[]') : pkg.gallery;
    
    res.json(pkg);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Error fetching package.' });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const [packages] = await req.db.query('SELECT * FROM packages WHERE slug = ?', [req.params.slug]);
    
    if (packages.length === 0) {
      return res.status(404).json({ message: 'Package not found.' });
    }
    
    const pkg = packages[0];
    pkg.itinerary = typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]') : pkg.itinerary;
    pkg.gallery = typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery || '[]') : pkg.gallery;
    
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching package.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, price, duration, location, description, itinerary, image, gallery, featured, status } = req.body;
    
    let slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const [existing] = await req.db.query('SELECT id FROM packages WHERE slug = ?', [slug]);
    let counter = 1;
    while (existing.length > 0) {
      slug = `${slug}-${counter}`;
      const [check] = await req.db.query('SELECT id FROM packages WHERE slug = ?', [slug]);
      if (check.length === 0) break;
      counter++;
    }

    const itineraryJson = JSON.stringify(itinerary || []);
    const galleryJson = JSON.stringify(gallery || []);

    const [result] = await req.db.query(
      `INSERT INTO packages (title, slug, price, duration, location, description, itinerary, image, gallery, featured, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, price, duration, location, description, itineraryJson, image, galleryJson, featured || false, status || 'active']
    );

    const [newPackage] = await req.db.query('SELECT * FROM packages WHERE id = ?', [result.insertId]);
    const pkg = newPackage[0];
    pkg.itinerary = JSON.parse(pkg.itinerary || '[]');
    pkg.gallery = JSON.parse(pkg.gallery || '[]');
    
    res.status(201).json(pkg);
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ message: 'Error creating package.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, price, duration, location, description, itinerary, image, gallery, featured, status } = req.body;
    
    let slug;
    if (title) {
      slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const [existing] = await req.db.query('SELECT id FROM packages WHERE slug = ? AND id != ?', [slug, req.params.id]);
      let counter = 1;
      while (existing.length > 0) {
        slug = `${slug}-${counter}`;
        const [check] = await req.db.query('SELECT id FROM packages WHERE slug = ? AND id != ?', [slug, req.params.id]);
        if (check.length === 0) break;
        counter++;
      }
    }

    const itineraryJson = itinerary ? JSON.stringify(itinerary) : null;
    const galleryJson = gallery ? JSON.stringify(gallery) : null;

    let query = 'UPDATE packages SET ';
    const params = [];
    
    if (title) { query += 'title = ?, '; params.push(title); }
    if (slug) { query += 'slug = ?, '; params.push(slug); }
    if (price) { query += 'price = ?, '; params.push(price); }
    if (duration) { query += 'duration = ?, '; params.push(duration); }
    if (location) { query += 'location = ?, '; params.push(location); }
    if (description) { query += 'description = ?, '; params.push(description); }
    if (itineraryJson) { query += 'itinerary = ?, '; params.push(itineraryJson); }
    if (image !== undefined) { query += 'image = ?, '; params.push(image); }
    if (galleryJson) { query += 'gallery = ?, '; params.push(galleryJson); }
    if (featured !== undefined) { query += 'featured = ?, '; params.push(featured); }
    if (status) { query += 'status = ?, '; params.push(status); }
    
    query = query.replace(/, $/, ' ');
    query += 'WHERE id = ?';
    params.push(req.params.id);

    await req.db.query(query, params);
    
    const [updatedPackage] = await req.db.query('SELECT * FROM packages WHERE id = ?', [req.params.id]);
    
    if (updatedPackage.length === 0) {
      return res.status(404).json({ message: 'Package not found.' });
    }
    
    const pkg = updatedPackage[0];
    pkg.itinerary = typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]') : pkg.itinerary;
    pkg.gallery = typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery || '[]') : pkg.gallery;
    
    res.json(pkg);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ message: 'Error updating package.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM packages WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Package not found.' });
    }
    
    res.json({ message: 'Package deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package.' });
  }
});

module.exports = router;
