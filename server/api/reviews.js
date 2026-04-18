const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

const formatReview = (r) => ({ id: r.id, name: r.name, email: r.email, rating: r.rating, comment: r.comment, packageId: r.package_id, packageName: r.package_name, status: r.status, createdAt: r.created_at });

module.exports = async function handler(req, res) {
  const { id, status, packageId, approved } = req.query;
  
  try {
    if (req.method === 'GET' && approved !== undefined) {
      const { rows } = await sql.query('SELECT * FROM reviews WHERE status = $1 ORDER BY created_at DESC', ['approved']);
      return res.json(rows.map(formatReview));
    }
    if (req.method === 'GET' && !id) {
      let where = [];
      if (status) where.push(`status = '${status}'`);
      if (packageId) where.push(`package_id = ${packageId}`);
      const { rows } = await sql.query(`SELECT * FROM reviews ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`);
      return res.json(rows.map(formatReview));
    }
    if (req.method === 'GET' && id) {
      const { rows } = await sql.query('SELECT * FROM reviews WHERE id = $1', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.json(formatReview(rows[0]));
    }
    if (req.method === 'POST') {
      const { name, email, rating, comment, packageId, packageName } = req.body;
      const { rows } = await sql`INSERT INTO reviews (name, email, rating, comment, package_id, package_name, status) VALUES (${name}, ${email}, ${rating}, ${comment}, ${packageId}, ${packageName}, 'pending') RETURNING *`;
      return res.status(201).json(formatReview(rows[0]));
    }
    if (req.method === 'PATCH' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      await sql.query('UPDATE reviews SET status = $1 WHERE id = $2', [req.body.status, id]);
      const { rows } = await sql.query('SELECT * FROM reviews WHERE id = $1', [id]);
      return res.json(formatReview(rows[0]));
    }
    if (req.method === 'DELETE' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      await sql.query('DELETE FROM reviews WHERE id = $1', [id]);
      return res.json({ message: 'Deleted' });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};