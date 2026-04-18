const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql } = require('../../db');

async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
      }

      const { rows: admins } = await sql`SELECT * FROM admins WHERE email = ${email}`;
      
      if (admins.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      await sql`UPDATE admins SET last_login = NOW() WHERE id = ${admin.id}`;

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET || 'komodo-sailing-secret-key-2024',
        { expiresIn: process.env.JWT_EXPIRES || '7d' }
      );

      res.json({
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

module.exports = handler;