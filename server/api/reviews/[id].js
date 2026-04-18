const { sql } = require('../../../db');
const authMiddleware = require('../../middleware/auth');

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

async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method === 'PATCH' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    const { status } = req.body;
    await sql.query('UPDATE reviews SET status = $1 WHERE id = $2', [status, id]);
    const { rows } = await sql.query('SELECT * FROM reviews WHERE id = $1', [id]);
    res.json(formatReview(rows[0]));
  } else if (method === 'DELETE' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    await sql.query('DELETE FROM reviews WHERE id = $1', [id]);
    res.json({ message: 'Review deleted successfully.', id });
  }
  res.setHeader('Allow', ['PATCH', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
module.exports = handler;