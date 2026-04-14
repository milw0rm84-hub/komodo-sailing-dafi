const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/public', async (req, res) => {
  try {
    const [[totalBookings], [totalPackages], [avgRating]] = await Promise.all([
      req.db.query('SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"'),
      req.db.query('SELECT COUNT(*) as count FROM packages'),
      req.db.query('SELECT AVG(rating) as avg FROM reviews WHERE status = "approved"')
    ]);

    res.json({
      guests: totalBookings[0].count || 500,
      packages: totalPackages[0].count || 10,
      rating: avgRating[0].avg ? (avgRating[0].avg).toFixed(1) : 4.7
    });
  } catch (error) {
    res.json({ guests: 500, packages: 10, rating: 4.7 });
  }
});

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

router.get('/', auth, async (req, res) => {
  try {
    const [[totalPackages], [totalBookings], [totalReviews], [pendingBookings], [pendingReviews], [recentBookings]] = await Promise.all([
      req.db.query('SELECT COUNT(*) as count FROM packages'),
      req.db.query('SELECT COUNT(*) as count FROM bookings'),
      req.db.query('SELECT COUNT(*) as count FROM reviews WHERE status = "approved"'),
      req.db.query('SELECT COUNT(*) as count FROM bookings WHERE status = "pending"'),
      req.db.query('SELECT COUNT(*) as count FROM reviews WHERE status = "pending"'),
      req.db.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5')
    ]);

    res.json({
      totalPackages: totalPackages[0].count,
      totalBookings: totalBookings[0].count,
      totalReviews: totalReviews[0].count,
      pendingBookings: pendingBookings[0].count,
      pendingReviews: pendingReviews[0].count,
      recentBookings: recentBookings.map(formatBooking)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats.' });
  }
});

module.exports = router;
