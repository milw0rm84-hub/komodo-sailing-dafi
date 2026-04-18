const { sql } = require('../../db');
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
  const { method, query, body } = req;
  const { id, status, search } = query;

  if (method === 'GET' && !id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    
    try {
      let where = [];
      if (status) where.push(`status = '${status}'`);
      if (search) where.push(`(customer_name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR whatsapp ILIKE '%${search}%')`);
      const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const { rows } = await sql.query(`SELECT * FROM bookings ${whereClause} ORDER BY created_at DESC`);
      res.json(rows.map(formatBooking));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bookings.' });
    }
  } else if (method === 'GET' && id) {
    try {
      const { rows } = await sql.query('SELECT * FROM bookings WHERE id = $1', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Booking not found.' });
      res.json(formatBooking(rows[0]));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching booking.' });
    }
  } else if (method === 'POST') {
    try {
      const { customerName, email, whatsapp, packageId, packageName, travelDate, numberOfGuests, notes } = body;
      const { rows } = await sql`
        INSERT INTO bookings (customer_name, email, whatsapp, package_id, package_name, travel_date, number_of_guests, notes) 
        VALUES (${customerName}, ${email}, ${whatsapp}, ${packageId}, ${packageName}, ${travelDate}, ${numberOfGuests || 1}, ${notes || ''})
        RETURNING *
      `;
      res.status(201).json(formatBooking(rows[0]));
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ message: 'Error creating booking.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
module.exports = handler;