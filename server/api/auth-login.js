const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql } = require('../db');

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
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

      await sql`UPDATE admins SET last_login = NOW() WHERE id = ${admin.id}`;
      const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'komodo-secret', { expiresIn: '7d' });

      return res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).end();
  }
};