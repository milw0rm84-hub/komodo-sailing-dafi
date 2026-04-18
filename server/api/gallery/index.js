const { sql } = require('../../db');
const authMiddleware = require('../../middleware/auth');

async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method === 'GET') {
    if (id) {
      const { rows } = await sql.query('SELECT * FROM gallery WHERE id = $1', [id]);
      return rows.length ? res.json(rows[0]) : res.status(404).json({ message: 'Image not found.' });
    }
    const { rows } = await sql.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(rows);
  } else if (method === 'POST') {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    const { url, caption, alt } = req.body;
    const { rows } = await sql`INSERT INTO gallery (url, caption, alt) VALUES (${url}, ${caption || ''}, ${alt || ''}) RETURNING *`;
    res.status(201).json(rows[0]);
  } else if (method === 'PUT' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    const { caption, alt } = req.body;
    await sql.query('UPDATE gallery SET caption = $1, alt = $2 WHERE id = $3', [caption || '', alt || '', id]);
    const { rows } = await sql.query('SELECT * FROM gallery WHERE id = $1', [id]);
    res.json(rows[0]);
  } else if (method === 'DELETE' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    await sql.query('DELETE FROM gallery WHERE id = $1', [id]);
    res.json({ message: 'Image deleted successfully.', id });
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
module.exports = handler;