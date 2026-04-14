const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, search, sort = 'created_at DESC' } = req.query;
    
    let query = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY ${sort}`;

    const [posts] = await req.db.query(query, params);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [posts] = await req.db.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post.' });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const [posts] = await req.db.query('SELECT * FROM blog_posts WHERE slug = ?', [req.params.slug]);
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, category, status, readTime, author } = req.body;
    
    let postSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const [existing] = await req.db.query('SELECT id FROM blog_posts WHERE slug = ?', [postSlug]);
    let counter = 1;
    while (existing.length > 0) {
      postSlug = `${postSlug}-${counter}`;
      const [check] = await req.db.query('SELECT id FROM blog_posts WHERE slug = ?', [postSlug]);
      if (check.length === 0) break;
      counter++;
    }

    const [result] = await req.db.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, image, category, status, read_time, author) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, postSlug, excerpt, content, image, category || 'Uncategorized', status || 'draft', readTime || 5, author || 'Admin']
    );

    const [newPost] = await req.db.query('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, category, status, readTime, author } = req.body;
    
    let postSlug = slug;
    if (title && !slug) {
      postSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const [existing] = await req.db.query('SELECT id FROM blog_posts WHERE slug = ? AND id != ?', [postSlug, req.params.id]);
      let counter = 1;
      while (existing.length > 0) {
        postSlug = `${postSlug}-${counter}`;
        const [check] = await req.db.query('SELECT id FROM blog_posts WHERE slug = ? AND id != ?', [postSlug, req.params.id]);
        if (check.length === 0) break;
        counter++;
      }
    }

    let query = 'UPDATE blog_posts SET ';
    const params = [];
    
    if (title) { query += 'title = ?, '; params.push(title); }
    if (postSlug) { query += 'slug = ?, '; params.push(postSlug); }
    if (excerpt) { query += 'excerpt = ?, '; params.push(excerpt); }
    if (content) { query += 'content = ?, '; params.push(content); }
    if (image !== undefined) { query += 'image = ?, '; params.push(image); }
    if (category) { query += 'category = ?, '; params.push(category); }
    if (status) { query += 'status = ?, '; params.push(status); }
    if (readTime) { query += 'read_time = ?, '; params.push(readTime); }
    if (author) { query += 'author = ?, '; params.push(author); }
    
    query = query.replace(/, $/, ' ');
    query += 'WHERE id = ?';
    params.push(req.params.id);

    await req.db.query(query, params);
    
    const [updatedPost] = await req.db.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    
    if (updatedPost.length === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    res.json(updatedPost[0]);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Error updating post.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    res.json({ message: 'Post deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post.' });
  }
});

module.exports = router;
