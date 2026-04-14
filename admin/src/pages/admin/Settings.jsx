import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Save, Loader, Globe, Mail, Phone, Image } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    site_name: 'Komodo Sailing Adventure',
    site_description: 'Your trusted partner for unforgettable Komodo National Park adventures',
    logo: '',
    hero_image: '',
    contact_email: 'komodocruisestour@gmail.com',
    contact_phone: '+62 878-6502-6171',
    whatsapp: '6287865026171',
    address: 'Gili Indah, Kec. Pemenang, Kabupaten Lombok Utara, Nusa Tenggara Barat 83352',
    social_media: {
      facebook: '',
      instagram: '',
      youtube: ''
    },
    seo: {
      title: 'Komodo Sailing Adventure | Liveaboard Trip to Komodo National Park',
      description: 'Experience the breathtaking beauty of Komodo National Park with our trusted liveaboard boats. From Lombok to Flores.',
      keywords: 'Komodo, Sailing, Adventure, Labuan Bajo, Flores, Lombok, Boat Trip, Liveaboard'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data) {
        const data = res.data;
        const formatted = {
          site_name: data.site_name || 'Komodo Sailing Adventure',
          site_description: data.site_description || 'Your trusted partner for unforgettable Komodo National Park adventures',
          logo: data.logo || '',
          hero_image: data.hero_image || '',
          contact_email: data.contact_email || 'komodocruisestour@gmail.com',
          contact_phone: data.contact_phone || '+62 878-6502-6171',
          whatsapp: data.whatsapp || '6287865026171',
          address: data.address || 'Gili Indah, Kec. Pemenang, Kabupaten Lombok Utara, Nusa Tenggara Barat 83352',
          social_media: typeof data.social_media === 'string' ? JSON.parse(data.social_media || '{}') : (data.social_media || { facebook: '', instagram: '', youtube: '' }),
          seo: typeof data.seo === 'string' ? JSON.parse(data.seo || '{}') : (data.seo || { title: '', description: '', keywords: '' })
        };
        setSettings(formatted);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: { ...settings[parent], [child]: value }
      });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put('/settings', settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slideIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-500 mt-1">Configure your website global settings</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              name="site_name"
              value={settings.site_name}
              onChange={handleChange}
              className="input-field"
              placeholder="Your website name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
            <textarea
              name="site_description"
              value={settings.site_description}
              onChange={handleChange}
              rows="2"
              className="input-field resize-none"
              placeholder="Brief description of your website"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="text"
                name="logo"
                value={settings.logo}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input
                type="text"
                name="hero_image"
                value={settings.hero_image}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (without +)</label>
            <input
              type="text"
              name="whatsapp"
              value={settings.whatsapp}
              onChange={handleChange}
              className="input-field"
              placeholder="6281234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={settings.address}
              onChange={handleChange}
              rows="2"
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="text"
                name="social_media.facebook"
                value={settings.social_media.facebook}
                onChange={handleChange}
                className="input-field"
                placeholder="facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="text"
                name="social_media.instagram"
                value={settings.social_media.instagram}
                onChange={handleChange}
                className="input-field"
                placeholder="@username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input
                type="text"
                name="social_media.youtube"
                value={settings.social_media.youtube}
                onChange={handleChange}
                className="input-field"
                placeholder="youtube.com/..."
              />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              name="seo.title"
              value={settings.seo.title}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              name="seo.description"
              value={settings.seo.description}
              onChange={handleChange}
              rows="3"
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
            <input
              type="text"
              name="seo.keywords"
              value={settings.seo.keywords}
              onChange={handleChange}
              className="input-field"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
