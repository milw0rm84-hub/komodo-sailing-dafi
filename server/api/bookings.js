const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

const formatBooking = (b) => ({ id: b.id, customerName: b.customer_name, email: b.email, whatsapp: b.whatsapp, packageId: b.package_id, packageName: b.package_name, travelDate: b.travel_date, numberOfGuests: b.number_of_guests, notes: b.notes, status: b.status, createdAt: b.created_at });

module.exports = async function handler(req, res) {
  const { id, status: qStatus, search } = req.query;
  
  try {
    if (req.method === 'GET' && !id) {
      let where = [];
      if (qStatus) where.push(`status = '${qStatus}'`);
      if (search) where.push(`(customer_name ILIKE '%${search}%' OR email ILIKE '%${search}%')`);
      const { rows } = await sql.query(`SELECT * FROM bookings ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`);
      return res.json(rows.map(formatBooking));
    }
    if (req.method === 'GET' && id) {
      const { rows } = await sql.query('SELECT * FROM bookings WHERE id = $1', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.json(formatBooking(rows[0]));
    }
    if (req.method === 'POST') {
      const { customerName, email, whatsapp, packageId, packageName, travelDate, numberOfGuests, notes } = req.body;
      const { rows } = await sql`INSERT INTO bookings (customer_name, email, whatsapp, package_id, package_name, travel_date, number_of_guests, notes) VALUES (${customerName}, ${email}, ${whatsapp}, ${packageId}, ${packageName}, ${travelDate}, ${numberOfGuests || 1}, ${notes || ''}) RETURNING *`;
      return res.status(201).json(formatBooking(rows[0]));
    }
    if (req.method === 'PATCH' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      const { status, customerName, email, whatsapp, travelDate, numberOfGuests, notes } = req.body;
      const updates = [];
      if (status) updates.push(`status = '${status}'`);
      if (customerName) updates.push(`customer_name = '${customerName}'`);
      if (email) updates.push(`email = '${email}'`);
      if (whatsapp) updates.push(`whatsapp = '${whatsapp}'`);
      if (travelDate) updates.push(`travel_date = '${travelDate}'`);
      if (numberOfGuests) updates.push(`number_of_guests = ${numberOfGuests}`);
      if (notes !== undefined) updates.push(`notes = '${notes}'`);
      if (!updates.length) return res.status(400).json({ message: 'No fields' });
      await sql.query(`UPDATE bookings SET ${updates.join(', ')} WHERE id = $1`, [id]);
      const { rows } = await sql.query('SELECT * FROM bookings WHERE id = $1', [id]);
      return res.json(formatBooking(rows[0]));
    }
    if (req.method === 'DELETE' && id) {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      await sql.query('DELETE FROM bookings WHERE id = $1', [id]);
      return res.json({ message: 'Deleted' });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};