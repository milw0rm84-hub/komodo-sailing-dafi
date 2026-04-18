const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql.query('SELECT * FROM settings WHERE id = 1');
      if (!rows.length) {
        return res.json({ id: 1, site_name: 'Komodo Sailing', site_description: 'Your trusted partner for Komodo adventures', contact_email: 'test@example.com', contact_phone: '+62 0000000000', whatsapp: '620000000000', address: 'Indonesia', social_media: { facebook: '', instagram: '' }, seo: { title: 'Komodo Sailing', description: 'Experience Komodo' } });
      }
      const data = rows[0];
      try { data.social_media = JSON.parse(data.social_media || '{}'); data.seo = JSON.parse(data.seo || '{}'); } catch (e) { data.social_media = {}; data.seo = {}; }
      return res.json(data);
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};