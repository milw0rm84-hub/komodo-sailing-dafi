const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

const formatBooking = (b) => ({ id: b.id, customerName: b.customer_name, email: b.email, whatsapp: b.whatsapp, packageId: b.package_id, packageName: b.package_name, travelDate: b.travel_date, numberOfGuests: b.number_of_guests, notes: b.notes, status: b.status, createdAt: b.created_at });

module.exports = async function handler(req, res) {
  const { public: isPublic } = req.query;
  
  try {
    if (req.method === 'GET' && isPublic !== undefined) {
      try {
        const [tb, tp, tr] = await Promise.all([
          sql.query('SELECT COUNT(*) as c FROM bookings WHERE status = $1', ['confirmed']),
          sql.query('SELECT COUNT(*) as c FROM packages'),
          sql.query('SELECT AVG(rating) as a FROM reviews WHERE status = $1', ['approved'])
        ]);
        return res.json({ guests: tb.rows[0]?.c || 500, packages: tp.rows[0]?.c || 10, rating: tr.rows[0]?.a ? parseFloat(tr.rows[0].a).toFixed(1) : 4.7 });
      } catch (e) { return res.json({ guests: 500, packages: 10, rating: 4.7 }); }
    }
    
    if (req.method === 'GET' && isPublic === undefined) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      try {
        const [tp, tb, tr, pb, pr, rb] = await Promise.all([
          sql.query('SELECT COUNT(*) as c FROM packages'),
          sql.query('SELECT COUNT(*) as c FROM bookings'),
          sql.query('SELECT COUNT(*) as c FROM reviews WHERE status = $1', ['approved']),
          sql.query('SELECT COUNT(*) as c FROM bookings WHERE status = $1', ['pending']),
          sql.query('SELECT COUNT(*) as c FROM reviews WHERE status = $1', ['pending']),
          sql.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5')
        ]);
        return res.json({ totalPackages: tp.rows[0]?.c || 0, totalBookings: tb.rows[0]?.c || 0, totalReviews: tr.rows[0]?.c || 0, pendingBookings: pb.rows[0]?.c || 0, pendingReviews: pr.rows[0]?.c || 0, recentBookings: rb.rows.map(formatBooking) });
      } catch (e) { return res.status(500).json({ message: 'Error' }); }
    }
    
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};