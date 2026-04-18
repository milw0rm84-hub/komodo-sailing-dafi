const { sql } = require('../db');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    res.json({ status: 'ok', message: 'Komodo Sailing API Running' });
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};