const { sql } = require('../../../db');

async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method === 'GET') {
    try {
      if (!id) {
        return res.status(400).json({ message: 'Package ID required.' });
      }

      let query, params;
      
      if (isNaN(id)) {
        query = 'SELECT * FROM packages WHERE slug = $1';
        params = [id];
      } else {
        query = 'SELECT * FROM packages WHERE id = $1';
        params = [parseInt(id)];
      }
      
      const { rows } = await sql.query(query, params);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Package not found.' });
      }
      
      const pkg = rows[0];
      pkg.itinerary = typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]') : pkg.itinerary;
      pkg.gallery = typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery || '[]') : pkg.gallery;
      
      res.json(pkg);
    } catch (error) {
      console.error('Error fetching package:', error);
      res.status(500).json({ message: 'Error fetching package.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

module.exports = handler;