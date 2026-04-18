const { sql } = require('../../db');
const authMiddleware = require('../../middleware/auth');

async function handler(req, res) {
  const { method, query, body } = req;
  const { id, slug, status, search } = query;

  if (method === 'GET' && !id && !slug) {
    try {
      let where = [];
      if (status) where.push(`status = '${status}'`);
      if (search) where.push(`(title ILIKE '%${search}%' OR content ILIKE '%${search}%')`);
      const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const { rows } = await sql.query(`SELECT * FROM blog_posts ${whereClause} ORDER BY created_at DESC`);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts.' });
    }
  } else if (method === 'GET' && id) {
    const { rows } = await sql.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found.' });
    res.json(rows[0]);
  } else if (method === 'GET' && slug) {
    const { rows } = await sql.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found.' });
    res.json(rows[0]);
  } else if (method === 'POST') {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    try {
      const { title, slug: postSlug, excerpt, content, image, category, status: postStatus, readTime, author } = body;
      let blogSlug = postSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { rows } = await sql`
        INSERT INTO blog_posts (title, slug, excerpt, content, image, category, status, read_time, author) 
        VALUES (${title}, ${blogSlug}, ${excerpt}, ${content}, ${image}, ${category || 'Uncategorized'}, ${postStatus || 'draft'}, ${readTime || 5}, ${author || 'Admin'})
        RETURNING *
      `;
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post.' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
module.exports = handler;