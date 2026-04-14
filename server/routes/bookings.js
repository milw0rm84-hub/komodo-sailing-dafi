const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

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
    const { status, search, sort = 'created_at DESC' } = req.query;
    
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (customer_name LIKE ? OR email LIKE ? OR whatsapp LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY ${sort}`;

    const [bookings] = await req.db.query(query, params);
    res.json(bookings.map(formatBooking));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [bookings] = await req.db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    
    res.json(formatBooking(bookings[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerName, email, whatsapp, packageId, packageName, travelDate, numberOfGuests, notes } = req.body;
    
    const [result] = await req.db.query(
      `INSERT INTO bookings (customer_name, email, whatsapp, package_id, package_name, travel_date, number_of_guests, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerName, email, whatsapp, packageId, packageName, travelDate, numberOfGuests || 1, notes || '']
    );

    const [newBooking] = await req.db.query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
    res.status(201).json(formatBooking(newBooking[0]));
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Error creating booking.' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, customerName, email, whatsapp, travelDate, numberOfGuests, notes } = req.body;
    
    let query = 'UPDATE bookings SET ';
    const params = [];
    
    if (status) { query += 'status = ?, '; params.push(status); }
    if (customerName) { query += 'customer_name = ?, '; params.push(customerName); }
    if (email) { query += 'email = ?, '; params.push(email); }
    if (whatsapp) { query += 'whatsapp = ?, '; params.push(whatsapp); }
    if (travelDate) { query += 'travel_date = ?, '; params.push(travelDate); }
    if (numberOfGuests) { query += 'number_of_guests = ?, '; params.push(numberOfGuests); }
    if (notes !== undefined) { query += 'notes = ?, '; params.push(notes); }
    
    query = query.replace(/, $/, ' ');
    query += 'WHERE id = ?';
    params.push(req.params.id);

    const [result] = await req.db.query(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    
    const [updatedBooking] = await req.db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    res.json(formatBooking(updatedBooking[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    
    res.json({ message: 'Booking deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking.' });
  }
});

module.exports = router;
