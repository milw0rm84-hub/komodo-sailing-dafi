const { sql } = require('../../../db');
const authMiddleware = require('../../middleware/auth');

async function handler(req, res) {
  const { method, body } = req;
  const { id } = req.query;

  if (method === 'PUT' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    const { title, slug, excerpt, content, image, category, status: postStatus, readTime, author } = body;
    let postSlug = slug;
    if (title && !slug) postSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updates = [];
    if (title) updates.push(`title = '${title}'`);
    if (postSlug) updates.push(`slug = '${postSlug}'`);
    if (excerpt) updates.push(`excerpt = '${excerpt}'`);
    if (content) updates.push(`content = '${content}'`);
    if (image !== undefined) updates.push(`image = '${image}'`);
    if (category) updates.push(`category = '${category}'`);
    if (postStatus) updates.push(`status = '${postStatus}'`);
    if (readTime) updates.push(`read_time = ${readTime}`);
    if (author) updates.push(`author = '${author}'`);
    if (!updates.length) return res.status(400).json({ message: 'No fields to update.' });
    await sql.query(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $1`, [id]);
    const { rows } = await sql.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    res.json(rows[0]);
  } else if (method === 'DELETE' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    await sql.query('DELETE FROM blog_posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted successfully.', id });
  }
  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
module.exports = handler;