const { sql } = require('../../../db');

async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method === 'GET' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    const { rows } = await sql.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Booking not found.' });
    res.json(formatBooking(rows[0]));
  } else if (method === 'PATCH' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    const { status, customerName, email, whatsapp, travelDate, numberOfGuests, notes } = req.body;
    const updates = [];
    if (status) updates.push(`status = '${status}'`);
    if (customerName) updates.push(`customer_name = '${customerName}'`);
    if (email) updates.push(`email = '${email}'`);
    if (whatsapp) updates.push(`whatsapp = '${whatsapp}'`);
    if (travelDate) updates.push(`travel_date = '${travelDate}'`);
    if (numberOfGuests) updates.push(`number_of_guests = ${numberOfGuests}`);
    if (notes !== undefined) updates.push(`notes = '${notes}'`);
    if (updates.length === 0) return res.status(400).json({ message: 'No fields to update.' });
    await sql.query(`UPDATE bookings SET ${updates.join(', ')} WHERE id = $1`, [id]);
    const { rows } = await sql.query('SELECT * FROM bookings WHERE id = $1', [id]);
    res.json(formatBooking(rows[0]));
  } else if (method === 'DELETE' && id) {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    await sql.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.json({ message: 'Booking deleted successfully.', id });
  }
  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
module.exports = handler;