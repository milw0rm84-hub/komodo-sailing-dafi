const jwt = require('jsonwebtoken');
const { sql } = require('../db');

module.exports = async function auth(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'komodo-secret');
    
    const { rows } = await sql`SELECT id, email, name, role FROM admins WHERE id = ${decoded.id}`;
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.admin = rows[0];
    return null;
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};