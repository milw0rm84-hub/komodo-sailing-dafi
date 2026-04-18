const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const authErr = await authMiddleware(req, res);
    if (authErr) return;
    return res.json({ admin: { id: req.admin.id, email: req.admin.email, name: req.admin.name, role: req.admin.role } });
  }
  
  if (req.method === 'POST') {
    const authErr = await authMiddleware(req, res);
    if (authErr) return;
    const { currentPassword, newPassword } = req.body;
    const { rows } = await sql`SELECT * FROM admins WHERE id = ${req.admin.id}`;
    const admin = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });
    const hashed = await bcrypt.hash(newPassword, 12);
    await sql`UPDATE admins SET password = ${hashed} WHERE id = ${req.admin.id}`;
    return res.json({ message: 'Password changed' });
  }
  
  res.status(405).end();
};