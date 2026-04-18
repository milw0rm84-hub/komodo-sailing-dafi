const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql } = require('../db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'komodo-sailing-secret-key-2024');
    
    const { rows: admins } = await sql`SELECT id, email, name, role FROM admins WHERE id = ${decoded.id}`;
    
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.admin = admins[0];
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

module.exports = authMiddleware;