import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img
                src={settings.logo || 'https://komodocruisestour.com/wp-content/uploads/2024/10/Desain-tanpa-judul.png'}
                alt={settings.site_name}
                className="h-10 sm:h-14 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              {settings.site_description || 'Your trusted partner for unforgettable Komodo National Park adventures.'}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {settings.social_media?.facebook && (
                <a
                  href={settings.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="text-lg">f</span>
                </a>
              )}
              {settings.social_media?.instagram && (
                <a
                  href={settings.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="text-lg">i</span>
                </a>
              )}
              {settings.social_media?.youtube && (
                <a
                  href={settings.social_media.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="text-lg">yt</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/komodo-tour" className="text-gray-400 hover:text-primary transition-colors">
                  Komodo Tour
                </Link>
              </li>
              <li>
                <Link to="/lombok-tour" className="text-gray-400 hover:text-primary transition-colors">
                  Lombok Tour
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Tour Packages</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/komodo-tour/lombok-flores-4d3n-backpacker" className="text-gray-400 hover:text-primary transition-colors">
                  Lombok to Flores 4D3N Backpacker
                </Link>
              </li>
              <li>
                <Link to="/komodo-tour/lombok-flores-4d3n-deluxe" className="text-gray-400 hover:text-primary transition-colors">
                  Lombok to Flores 4D3N Deluxe
                </Link>
              </li>
              <li>
                <Link to="/komodo-tour/labuan-bajo-3d2n-komodo" className="text-gray-400 hover:text-primary transition-colors">
                  Labuan Bajo 3D2N Komodo
                </Link>
              </li>
              <li>
                <Link to="/komodo-tour/one-day-komodo-speedboat" className="text-gray-400 hover:text-primary transition-colors">
                  One Day Komodo Tour
                </Link>
              </li>
              <li>
                <Link to="/lombok-tour/rinjani-trekking-3d2n" className="text-gray-400 hover:text-primary transition-colors">
                  Rinjani Trekking 3D2N
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  {settings.address}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {settings.contact_email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-400">24/7 Customer Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Komodo Sailing Adventure. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
