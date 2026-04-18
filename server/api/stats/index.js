const { sql } = require('../../../db');
const authMiddleware = require('../../middleware/auth');

const formatBooking = (booking) => ({
  id: booking.id,
  customerName: booking.customer_name,
  email: booking.email,
  whatsapp: booking.whatsapp,
  packageId: booking.package_id,
  packageName: booking.package_name,
  travelDate: booking.travel_date,
  numberOfGuests: booking.number_of_guests,
  notes: booking.notes,
  status: booking.status,
  createdAt: booking.created_at
});

async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    
    try {
      const [totalPackages, totalBookings, totalReviews, pendingBookings, pendingReviews, recentBookings] = await Promise.all([
        sql.query('SELECT COUNT(*) as count FROM packages'),
        sql.query('SELECT COUNT(*) as count FROM bookings'),
        sql.query('SELECT COUNT(*) as count FROM reviews WHERE status = $1', ['approved']),
        sql.query('SELECT COUNT(*) as count FROM bookings WHERE status = $1', ['pending']),
        sql.query('SELECT COUNT(*) as count FROM reviews WHERE status = $1', ['pending']),
        sql.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5')
      ]);

      res.json({
        totalPackages: totalPackages.rows[0]?.count || 0,
        totalBookings: totalBookings.rows[0]?.count || 0,
        totalReviews: totalReviews.rows[0]?.count || 0,
        pendingBookings: pendingBookings.rows[0]?.count || 0,
        pendingReviews: pendingReviews.rows[0]?.count || 0,
        recentBookings: recentBookings.rows.map(formatBooking)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Error fetching stats.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
module.exports = handler;