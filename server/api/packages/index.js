const { sql } = require('../../../db');

async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method === 'GET') {
    if (id) {
      const { rows } = await sql.query('SELECT * FROM packages WHERE id = $1', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Package not found.' });
      return res.json(rows[0]);
    }
    const { featured, status, search, sort = 'created_at DESC' } = req.query;
    let where = [];
    if (featured !== undefined) where.push(featured === 'true' ? 'featured = true' : 'featured = false');
    if (status) where.push(`status = '${status}'`);
    if (search) where.push(`(title ILIKE '%${search}%' OR location ILIKE '%${search}%')`);
    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const { rows } = await sql.query(`SELECT * FROM packages ${whereClause} ORDER BY ${sort.replace(/['"]/g, '')}`);
    return res.json(rows.map(pkg => ({
      ...pkg,
      itinerary: typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]') : pkg.itinerary,
      gallery: typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery || '[]') : pkg.gallery
    })));
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
module.exports = handler;