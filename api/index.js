const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authMiddleware = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'komodo-secret');
    const { rows } = await sql`SELECT id, email, name, role FROM admins WHERE id = ${decoded.id}`;
    if (!rows.length) return res.status(401).json({ message: 'Invalid token' });
    req.admin = rows[0];
    return null;
  } catch (e) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = async function handler(req, res) {
  const { method, url } = req;
  const path = url.split('?')[0];

  try {
    // GET /api/settings
    if (method === 'GET' && path === '/api/settings') {
      const { rows } = await sql.query('SELECT * FROM settings WHERE id = 1');
      if (!rows.length) {
        return res.json({ id: 1, site_name: 'Komodo Sailing', site_description: 'Your trusted partner', contact_email: 'test@test.com', contact_phone: '+620000000', whatsapp: '620000000', address: 'Indonesia', social_media: { facebook: '', instagram: '' }, seo: { title: 'Komodo Sailing', description: 'Adventure' } });
      }
      const data = rows[0];
      try { data.social_media = JSON.parse(data.social_media || '{}'); data.seo = JSON.parse(data.seo || '{}'); } catch (e) { data.social_media = {}; data.seo = {}; }
      return res.json(data);
    }

    // POST /api/auth/login
    if (method === 'POST' && path === '/api/auth/login') {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
      
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
    }

    // GET /api/packages
    if (method === 'GET' && path === '/api/packages') {
      const { featured, status } = req.query;
      let where = [];
      if (featured !== undefined) where.push(featured === 'true' ? 'featured = true' : 'featured = false');
      if (status) where.push(`status = '${status}'`);
      const { rows } = await sql.query(`SELECT * FROM packages ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`);
      return res.json(rows.map(p => ({ ...p, itinerary: typeof p.itinerary === 'string' ? JSON.parse(p.itinerary || '[]') : p.itinerary, gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery || '[]') : p.gallery })));
    }

    // GET /api/packages?id=xxx or slug
    if (method === 'GET' && path === '/api/packages' && req.query.id) {
      const { id } = req.query;
      const { rows } = isNaN(id) 
        ? await sql.query('SELECT * FROM packages WHERE slug = $1', [id])
        : await sql.query('SELECT * FROM packages WHERE id = $1', [parseInt(id)]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      const p = rows[0];
      p.itinerary = typeof p.itinerary === 'string' ? JSON.parse(p.itinerary || '[]') : p.itinerary;
      p.gallery = typeof p.gallery === 'string' ? JSON.parse(p.gallery || '[]') : p.gallery;
      return res.json(p);
    }

    // POST /api/bookings
    if (method === 'POST' && path === '/api/bookings') {
      const { customerName, email, whatsapp, packageId, packageName, travelDate, numberOfGuests, notes } = req.body;
      const { rows } = await sql`INSERT INTO bookings (customer_name, email, whatsapp, package_id, package_name, travel_date, number_of_guests, notes) VALUES (${customerName}, ${email}, ${whatsapp}, ${packageId}, ${packageName}, ${travelDate}, ${numberOfGuests || 1}, ${notes || ''}) RETURNING *`;
      const b = rows[0];
      return res.status(201).json({ id: b.id, customerName: b.customer_name, email: b.email, whatsapp: b.whatsapp, packageId: b.package_id, packageName: b.package_name, travelDate: b.travel_date, numberOfGuests: b.number_of_guests, notes: b.notes, status: b.status, createdAt: b.created_at });
    }

    // GET /api/bookings
    if (method === 'GET' && path === '/api/bookings') {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      const { rows } = await sql.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.json(rows.map(b => ({ id: b.id, customerName: b.customer_name, email: b.email, whatsapp: b.whatsapp, packageId: b.package_id, packageName: b.package_name, travelDate: b.travel_date, numberOfGuests: b.number_of_guests, notes: b.notes, status: b.status, createdAt: b.created_at })));
    }

    // POST /api/reviews
    if (method === 'POST' && path === '/api/reviews') {
      const { name, email, rating, comment, packageId, packageName } = req.body;
      const { rows } = await sql`INSERT INTO reviews (name, email, rating, comment, package_id, package_name, status) VALUES (${name}, ${email}, ${rating}, ${comment}, ${packageId}, ${packageName}, 'pending') RETURNING *`;
      const r = rows[0];
      return res.status(201).json({ id: r.id, name: r.name, email: r.email, rating: r.rating, comment: r.comment, packageId: r.package_id, packageName: r.package_name, status: r.status, createdAt: r.created_at });
    }

    // GET /api/reviews
    if (method === 'GET' && path === '/api/reviews') {
      const { rows } = await sql.query('SELECT * FROM reviews ORDER BY created_at DESC');
      return res.json(rows.map(r => ({ id: r.id, name: r.name, email: r.email, rating: r.rating, comment: r.comment, packageId: r.package_id, packageName: r.package_name, status: r.status, createdAt: r.created_at })));
    }

    // GET /api/gallery
    if (method === 'GET' && path === '/api/gallery') {
      const { rows } = await sql.query('SELECT * FROM gallery ORDER BY created_at DESC');
      return res.json(rows);
    }

    // GET /api/health
    if (method === 'GET' && path === '/api/health') {
      return res.json({ status: 'ok', message: 'API Running' });
    }

    res.status(404).json({ message: 'Not found' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error', error: e.message });
  }
};