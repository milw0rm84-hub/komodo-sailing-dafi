const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [settings] = await req.db.query('SELECT * FROM settings WHERE id = 1');
    
    if (settings.length === 0) {
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
        social_media: JSON.stringify({ facebook: '', instagram: '', youtube: '' }),
        seo: JSON.stringify({
          title: 'Komodo Sailing Adventure | Liveaboard Trip to Komodo National Park',
          description: 'Experience the breathtaking beauty of Komodo National Park with our trusted liveaboard boats.',
          keywords: 'Komodo, Sailing, Adventure, Labuan Bajo, Flores, Lombok, Boat Trip'
        })
      };
      res.json(defaultSettings);
    } else {
      const data = settings[0];
      try {
        data.social_media = JSON.parse(data.social_media || '{}');
        data.seo = JSON.parse(data.seo || '{}');
      } catch (e) {
        data.social_media = {};
        data.seo = {};
      }
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings.' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const {
      site_name, site_description, logo, hero_image,
      contact_email, contact_phone, whatsapp, address,
      social_media, seo
    } = req.body;

    const socialMediaJson = typeof social_media === 'string' ? social_media : JSON.stringify(social_media || {});
    const seoJson = typeof seo === 'string' ? seo : JSON.stringify(seo || {});

    const [existing] = await req.db.query('SELECT id FROM settings WHERE id = 1');

    if (existing.length === 0) {
      await req.db.query(
        `INSERT INTO settings (id, site_name, site_description, logo, hero_image, contact_email, contact_phone, whatsapp, address, social_media, seo) 
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [site_name, site_description, logo, hero_image, contact_email, contact_phone, whatsapp, address, socialMediaJson, seoJson]
      );
    } else {
      await req.db.query(
        `UPDATE settings SET 
         site_name = ?, site_description = ?, logo = ?, hero_image = ?,
         contact_email = ?, contact_phone = ?, whatsapp = ?, address = ?,
         social_media = ?, seo = ?
         WHERE id = 1`,
        [site_name, site_description, logo, hero_image, contact_email, contact_phone, whatsapp, address, socialMediaJson, seoJson]
      );
    }

    const [updated] = await req.db.query('SELECT * FROM settings WHERE id = 1');
    res.json(updated[0]);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Error updating settings.' });
  }
});

module.exports = router;
