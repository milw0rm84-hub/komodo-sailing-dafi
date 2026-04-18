const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

const formatPkg = (p) => ({ ...p, itinerary: typeof p.itinerary === 'string' ? JSON.parse(p.itinerary || '[]') : p.itinerary, gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery || '[]') : p.gallery });

module.exports = async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      if (id) {
        const { rows } = isNaN(id) 
          ? await sql.query('SELECT * FROM packages WHERE slug = $1', [id])
          : await sql.query('SELECT * FROM packages WHERE id = $1', [parseInt(id)]);
        if (!rows.length) return res.status(404).json({ message: 'Not found' });
        return res.json(formatPkg(rows[0]));
      }
      const { featured, status, search, sort } = req.query;
      let where = [];
      if (featured !== undefined) where.push(featured === 'true' ? 'featured = true' : 'featured = false');
      if (status) where.push(`status = '${status}'`);
      if (search) where.push(`(title ILIKE '%${search}%' OR location ILIKE '%${search}%')`);
      const { rows } = await sql.query(`SELECT * FROM packages ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${(sort || 'created_at DESC').replace(/['"]/g, '')}`);
      return res.json(rows.map(formatPkg));
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error' });
    }
  }
  
  res.status(405).end();
};