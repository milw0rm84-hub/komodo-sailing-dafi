const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

module.exports = async function handler(req, res) {
  const { id } = req.query;
  
  try {
    if (req.method === 'GET' && !id) {
      const { rows } = await sql.query('SELECT * FROM gallery ORDER BY created_at DESC');
      return res.json(rows);
    }
    if (req.method === 'GET' && id) {
      const { rows } = await sql.query('SELECT * FROM gallery WHERE id = $1', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.json(rows[0]);
    }
    if (req.method === 'POST') {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      const { url, caption, alt } = req.body;
      const { rows } = await sql`INSERT INTO gallery (url, caption, alt) VALUES (${url}, ${caption || ''}, ${alt || ''}) RETURNING *`;
      return res.status(201).json(rows[0]);
    }
    if (req.method === 'PUT' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      const { caption, alt } = req.body;
      await sql.query('UPDATE gallery SET caption = $1, alt = $2 WHERE id = $3', [caption || '', alt || '', id]);
      const { rows } = await sql.query('SELECT * FROM gallery WHERE id = $1', [id]);
      return res.json(rows[0]);
    }
    if (req.method === 'DELETE' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      await sql.query('DELETE FROM gallery WHERE id = $1', [id]);
      return res.json({ message: 'Deleted' });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};