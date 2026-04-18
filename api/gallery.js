const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql.query('SELECT * FROM gallery ORDER BY created_at DESC');
      return res.json(rows);
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};