import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const path = req.url.split('?')[0];

  try {
    // GET /api or /api/health
    if (req.method === 'GET' && (path === '/api' || path === '/api/health')) {
      return res.json({ status: 'ok', message: 'API Running' });
    }

    // GET /api/settings
    if (req.method === 'GET' && path === '/api/settings') {
      try {
        const { rows } = await sql.query('SELECT * FROM settings WHERE id = 1');
        if (!rows.length) {
          return res.json({ 
            id: 1, site_name: 'Komodo Sailing', site_description: 'Your trusted partner',
            contact_email: 'test@test.com', contact_phone: '+620000000', whatsapp: '620000000',
            address: 'Indonesia', social_media: { facebook: '', instagram: '' }, seo: { title: 'Komodo Sailing' }
          });
        }
        return res.json(rows[0]);
      } catch (e) {
        return res.json({ message: 'DB not connected', dbError: e.message });
      }
    }

    // POST /api/auth/login
    if (req.method === 'POST' && path === '/api/auth/login') {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
      
      try {
        const { rows } = await sql`SELECT * FROM admins WHERE email = ${email}`;
        
        if (!rows.length) {
          const hashed = await bcrypt.hash(password, 12);
          const { rows: newRows } = await sql`INSERT INTO admins (email, password, name, role) VALUES (${email}, ${hashed}, 'Admin', 'admin') RETURNING *`;
          const token = jwt.sign({ id: newRows[0].id, email: newRows[0].email, role: newRows[0].role }, process.env.JWT_SECRET || 'komodo-secret', { expiresIn: '7d' });
          return res.json({ token, admin: { id: newRows[0].id, email: newRows[0].email, name: newRows[0].name, role: newRows[0].role } });
        }
        
        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'komodo-secret', { expiresIn: '7d' });
        return res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
      } catch (e) {
        return res.status(500).json({ message: 'DB Error', error: e.message });
      }
    }

    // GET /api/packages
    if (req.method === 'GET' && path === '/api/packages') {
      try {
        const { rows } = await sql.query('SELECT * FROM packages ORDER BY created_at DESC');
        return res.json(rows);
      } catch (e) {
        return res.json([]);
      }
    }

    // POST /api/bookings
    if (req.method === 'POST' && path === '/api/bookings') {
      const { customerName, email, whatsapp, packageId, packageName, travelDate, numberOfGuests, notes } = req.body;
      try {
        const { rows } = await sql`INSERT INTO bookings (customer_name, email, whatsapp, package_id, package_name, travel_date, number_of_guests, notes) VALUES (${customerName}, ${email}, ${whatsapp}, ${packageId}, ${packageName}, ${travelDate}, ${numberOfGuests || 1}, ${notes || ''}) RETURNING *`;
        return res.status(201).json({ id: rows[0].id, message: 'Booking created' });
      } catch (e) {
        return res.status(500).json({ message: 'Error creating booking' });
      }
    }

    // GET /api/reviews
    if (req.method === 'GET' && path === '/api/reviews') {
      try {
        const { rows } = await sql.query('SELECT * FROM reviews ORDER BY created_at DESC');
        return res.json(rows);
      } catch (e) {
        return res.json([]);
      }
    }

    // GET /api/gallery
    if (req.method === 'GET' && path === '/api/gallery') {
      try {
        const { rows } = await sql.query('SELECT * FROM gallery ORDER BY created_at DESC');
        return res.json(rows);
      } catch (e) {
        return res.json([]);
      }
    }

    res.status(404).json({ message: 'Not found' });
  } catch (e) {
    console.error('Error:', e.message);
    res.status(500).json({ message: 'Server error', error: e.message });
  }
}