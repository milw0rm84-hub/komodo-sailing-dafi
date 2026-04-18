const { sql } = require('../../db');
const authMiddleware = require('../../middleware/auth');

async function handler(req, res) {
  const { method, query } = req;

  if (method === 'GET') {
    try {
      const { rows } = await sql.query('SELECT * FROM settings WHERE id = 1');
      
      if (rows.length === 0) {
        const defaultSettings = {
          id: 1,
          site_name: 'Komodo Sailing Adventure',
          site_description: 'Your trusted partner for unforgettable Komodo National Park adventures',
          logo: '',
          hero_image: '',
          contact_email: 'komodocruisestour@gmail.com',
          contact_phone: '+62 878-6502-6171',
          whatsapp: '6287865026171',
          address: 'Gili Indah, Kec. Pemenang, Kabupaten Lombok Utara, Nusa Tenggara Barat 83352',
          social_media: { facebook: '', instagram: '', youtube: '' },
          seo: {
            title: 'Komodo Sailing Adventure | Liveaboard Trip to Komodo National Park',
            description: 'Experience the breathtaking beauty of Komodo National Park with our trusted liveaboard boats.',
            keywords: 'Komodo, Sailing, Adventure, Labuan Bajo, Flores, Lombok, Boat Trip'
          }
        };
        return res.json(defaultSettings);
      }
      
      const data = rows[0];
      try {
        data.social_media = typeof data.social_media === 'string' ? JSON.parse(data.social_media || '{}') : (data.social_media || {});
        data.seo = typeof data.seo === 'string' ? JSON.parse(data.seo || '{}') : (data.seo || {});
      } catch (e) {
        data.social_media = {};
        data.seo = {};
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching settings.' });
    }
  } else if (method === 'PUT') {
    const authError = await authMiddleware(req, res);
    if (authError) return;
    
    try {
      const { site_name, site_description, logo, hero_image, contact_email, contact_phone, whatsapp, address, social_media, seo } = req.body;
      const socialMediaJson = typeof social_media === 'string' ? social_media : JSON.stringify(social_media || {});
      const seoJson = typeof seo === 'string' ? seo : JSON.stringify(seo || {});

      const { rows: existing } = await sql.query('SELECT id FROM settings WHERE id = 1');
      
      if (existing.length === 0) {
        await sql`
          INSERT INTO settings (id, site_name, site_description, logo, hero_image, contact_email, contact_phone, whatsapp, address, social_media, seo) 
          VALUES (1, ${site_name}, ${site_description}, ${logo}, ${hero_image}, ${contact_email}, ${contact_phone}, ${whatsapp}, ${address}, ${socialMediaJson}, ${seoJson})
        `;
      } else {
        await sql`
          UPDATE settings SET 
            site_name = ${site_name}, site_description = ${site_description}, logo = ${logo}, hero_image = ${hero_image},
            contact_email = ${contact_email}, contact_phone = ${contact_phone}, whatsapp = ${whatsapp}, address = ${address},
            social_media = ${socialMediaJson}, seo = ${seoJson}
          WHERE id = 1
        `;
      }

      const { rows } = await sql.query('SELECT * FROM settings WHERE id = 1');
      res.json(rows[0]);
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ message: 'Error updating settings.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
module.exports = handler;