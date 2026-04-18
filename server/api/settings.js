const { sql } = require('../db');
const authMiddleware = require('../middleware/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql.query('SELECT * FROM settings WHERE id = 1');
      if (!rows.length) {
        return res.json({
          id: 1, site_name: 'Komodo Sailing', site_description: 'Your trusted partner for Komodo adventures',
          logo: '', hero_image: '', contact_email: 'test@example.com', contact_phone: '+62 0000000000',
          whatsapp: '620000000000', address: 'Indonesia',
          social_media: { facebook: '', instagram: '', youtube: '' },
          seo: { title: 'Komodo Sailing', description: 'Experience Komodo National Park', keywords: 'Komodo, Sailing' }
        });
      }
      const data = rows[0];
      try { data.social_media = JSON.parse(data.social_media || '{}'); data.seo = JSON.parse(data.seo || '{}'); } catch (e) { data.social_media = {}; data.seo = {}; }
      return res.json(data);
    }
    if (req.method === 'PUT') {
      const authErr = await authMiddleware(req, res);
      if (authErr) return;
      const { site_name, site_description, logo, hero_image, contact_email, contact_phone, whatsapp, address, social_media, seo } = req.body;
      const socialMediaJson = typeof social_media === 'string' ? social_media : JSON.stringify(social_media || {});
      const seoJson = typeof seo === 'string' ? seo : JSON.stringify(seo || {});
      const { rows: existing } = await sql.query('SELECT id FROM settings WHERE id = 1');
      if (!existing.length) {
        await sql`INSERT INTO settings (id, site_name, site_description, logo, hero_image, contact_email, contact_phone, whatsapp, address, social_media, seo) VALUES (1, ${site_name}, ${site_description}, ${logo}, ${hero_image}, ${contact_email}, ${contact_phone}, ${whatsapp}, ${address}, ${socialMediaJson}, ${seoJson})`;
      } else {
        await sql`UPDATE settings SET site_name = ${site_name}, site_description = ${site_description}, logo = ${logo}, hero_image = ${hero_image}, contact_email = ${contact_email}, contact_phone = ${contact_phone}, whatsapp = ${whatsapp}, address = ${address}, social_media = ${socialMediaJson}, seo = ${seoJson} WHERE id = 1`;
      }
      const { rows } = await sql.query('SELECT * FROM settings WHERE id = 1');
      return res.json(rows[0]);
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};