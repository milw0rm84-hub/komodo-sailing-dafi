const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const { id } = req.query;
  
  try {
    if (req.method === 'GET' && !id) {
      const { rows } = await sql.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.json(rows.map(b => ({ id: b.id, customerName: b.customer_name, email: b.email, whatsapp: b.whatsapp, packageId: b.package_id, packageName: b.package_name, travelDate: b.travel_date, numberOfGuests: b.number_of_guests, notes: b.notes, status: b.status, createdAt: b.created_at })));
    }
    if (req.method === 'GET' && id) {
      const { rows } = await sql.query('SELECT * FROM bookings WHERE id = $1', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      const b = rows[0];
      return res.json({ id: b.id, customerName: b.customer_name, email: b.email, whatsapp: b.whatsapp, packageId: b.package_id, packageName: b.package_name, travelDate: b.travel_date, numberOfGuests: b.number_of_guests, notes: b.notes, status: b.status, createdAt: b.created_at });
    }
    if (req.method === 'POST') {
      const { customerName, email, whatsapp, packageId, packageName, travelDate, numberOfGuests, notes } = req.body;
      const { rows } = await sql`INSERT INTO bookings (customer_name, email, whatsapp, package_id, package_name, travel_date, number_of_guests, notes) VALUES (${customerName}, ${email}, ${whatsapp}, ${packageId}, ${packageName}, ${travelDate}, ${numberOfGuests || 1}, ${notes || ''}) RETURNING *`;
      const b = rows[0];
      return res.status(201).json({ id: b.id, customerName: b.customer_name, email: b.email, whatsapp: b.whatsapp, packageId: b.package_id, packageName: b.package_name, travelDate: b.travel_date, numberOfGuests: b.number_of_guests, notes: b.notes, status: b.status, createdAt: b.created_at });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};