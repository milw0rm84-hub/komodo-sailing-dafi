import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    site_name: 'Komodo Sailing Adventure',
    site_description: 'Your trusted partner for unforgettable Komodo National Park adventures',
    logo: '',
    hero_image: '',
    contact_email: 'komodocruisestour@gmail.com',
    contact_phone: '+62 878-6502-6171',
    whatsapp: '6287865026171',
    address: 'Gili Indah, Kec. Pemenang, Kabupaten Lombok Utara, Nusa Tenggara Barat 83352',
    social_media: { facebook: '', instagram: '', youtube: '' },
    seo: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/settings`);
      if (res.ok) {
        const data = await res.json();
        const formatted = {
          ...data,
          social_media: typeof data.social_media === 'string' 
            ? JSON.parse(data.social_media || '{}') 
            : (data.social_media || { facebook: '', instagram: '', youtube: '' }),
          seo: typeof data.seo === 'string' 
            ? JSON.parse(data.seo || '{}') 
            : (data.seo || {})
        };
        setSettings(formatted);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
