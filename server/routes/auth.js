const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const [admins] = await req.db.query('SELECT * FROM admins WHERE email = ?', [email]);
    
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    await req.db.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);

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
});

router.get('/me', auth, async (req, res) => {
  res.json({
    admin: {
      id: req.admin.id,
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role
    }
  });
});

router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const [admins] = await req.db.query('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    const admin = admins[0];
    
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await req.db.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, req.admin.id]);

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password.' });
  }
});

module.exports = router;
