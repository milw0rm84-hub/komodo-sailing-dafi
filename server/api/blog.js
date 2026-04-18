const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

module.exports = async function handler(req, res) {
  const { id, slug, status, search } = req.query;
  
  try {
    if (req.method === 'GET' && !id && !slug) {
      let where = [];
      if (status) where.push(`status = '${status}'`);
      if (search) where.push(`(title ILIKE '%${search}%' OR content ILIKE '%${search}%')`);
      const { rows } = await sql.query(`SELECT * FROM blog_posts ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`);
      return res.json(rows);
    }
    if (req.method === 'GET' && (id || slug)) {
      const { rows } = id 
        ? await sql.query('SELECT * FROM blog_posts WHERE id = $1', [id])
        : await sql.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.json(rows[0]);
    }
    if (req.method === 'POST') {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      const { title, slug: postSlug, excerpt, content, image, category, status: postStatus, readTime, author } = req.body;
      let blogSlug = postSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { rows } = await sql`INSERT INTO blog_posts (title, slug, excerpt, content, image, category, status, read_time, author) VALUES (${title}, ${blogSlug}, ${excerpt}, ${content}, ${image}, ${category || 'Uncategorized'}, ${postStatus || 'draft'}, ${readTime || 5}, ${author || 'Admin'}) RETURNING *`;
      return res.status(201).json(rows[0]);
    }
    if (req.method === 'PUT' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      const { title, slug: postSlug, excerpt, content, image, category, status: postStatus, readTime, author } = req.body;
      let blogSlug = postSlug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : null);
      const updates = [];
      if (title) updates.push(`title = '${title}'`);
      if (blogSlug) updates.push(`slug = '${blogSlug}'`);
      if (excerpt) updates.push(`excerpt = '${excerpt}'`);
      if (content) updates.push(`content = '${content}'`);
      if (image !== undefined) updates.push(`image = '${image}'`);
      if (category) updates.push(`category = '${category}'`);
      if (postStatus) updates.push(`status = '${postStatus}'`);
      if (readTime) updates.push(`read_time = ${readTime}`);
      if (author) updates.push(`author = '${author}'`);
      if (!updates.length) return res.status(400).json({ message: 'No fields' });
      await sql.query(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $1`, [id]);
      const { rows } = await sql.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
      return res.json(rows[0]);
    }
    if (req.method === 'DELETE' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      await sql.query('DELETE FROM blog_posts WHERE id = $1', [id]);
      return res.json({ message: 'Deleted' });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};