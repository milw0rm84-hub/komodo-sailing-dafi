const { sql } = require('../../db');

async function handler(req, res) {
  const { method, query } = req;

  if (method === 'GET' && query.public !== undefined) {
    try {
      const [[totalBookings], [totalPackages], [avgRating]] = await Promise.all([
        sql.query('SELECT COUNT(*) as count FROM bookings WHERE status = $1', ['confirmed']),
        sql.query('SELECT COUNT(*) as count FROM packages'),
        sql.query('SELECT AVG(rating) as avg FROM reviews WHERE status = $1', ['approved'])
      ]);

      res.json({
        guests: totalBookings.rows[0]?.count || 500,
        packages: totalPackages.rows[0]?.count || 10,
        rating: avgRating.rows[0]?.avg ? parseFloat(avgRating.rows[0].avg).toFixed(1) : 4.7
      });
    } catch (error) {
      res.json({ guests: 500, packages: 10, rating: 4.7 });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
module.exports = handler;