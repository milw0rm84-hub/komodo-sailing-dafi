const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql } = require('../../db');
const authMiddleware = require('../../middleware/auth');

async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    
    res.json({
      admin: {
        id: req.admin.id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role
      }
    });
  } else if (method === 'POST') {
    const authError = await authMiddleware(req, res);
    if (authError) return;

    try {
      const { currentPassword, newPassword } = req.body;
      
      const { rows: admins } = await sql`SELECT * FROM admins WHERE id = ${req.admin.id}`;
      const admin = admins[0];
      
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await sql`UPDATE admins SET password = ${hashedPassword} WHERE id = ${req.admin.id}`;

      res.json({ message: 'Password changed successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

module.exports = handler;