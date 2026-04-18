const { sql } = require('../../db');

async function handler(req, res) {
  const { method, query } = req;
  if (method === 'GET') {
    const { rows } = await sql.query('SELECT * FROM reviews WHERE status = $1 ORDER BY created_at DESC', ['approved']);
    res.json(rows);
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
module.exports = handler;