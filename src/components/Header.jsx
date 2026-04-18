import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const navigation = [
  {
    name: 'Komodo Tour',
    href: '/komodo-tour',
    submenu: [
      { name: 'Lombok - Flores 4D3N Backpacker', href: '/komodo-tour/lombok-flores-4d3n-backpacker' },
      { name: 'Lombok - Flores 4D3N Deluxe', href: '/komodo-tour/lombok-flores-4d3n-deluxe' },
      { name: 'Flores - Lombok 5D4N', href: '/komodo-tour/flores-lombok-5d4n-adventure' },
      { name: 'Labuan Bajo 3D2N', href: '/komodo-tour/labuan-bajo-3d2n-komodo' },
      { name: 'Labuan Bajo 2D1N', href: '/komodo-tour/labuan-bajo-2d1n-komodo' },
      { name: 'One Day Komodo', href: '/komodo-tour/one-day-komodo-speedboat' },
      { name: 'Private Charter', href: '/komodo-tour/private-charter-komodo' },
      { name: 'Shared Trip 3D2N Budget', href: '/komodo-tour/shared-trip-3d2n-budget' },
    ],
  },
  {
    name: 'Lombok Tour',
    href: '/lombok-tour',
    submenu: [
      { name: 'Rinjani Trekking 3D2N', href: '/lombok-tour/rinjani-trekking-3d2n' },
      { name: 'Rinjani Trekking 2D1N', href: '/lombok-tour/rinjani-trekking-2d1n' },
      { name: 'Snorkeling Gili Islands', href: '/lombok-tour/snorkeling-gili-islands' },
    ],
  },
  { name: 'About Us', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center">
            <img
              src={settings.logo || '/logo.svg'}
              alt={settings.site_name}
              className="h-10 sm:h-14 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div
                    className="relative group"
                    onMouseEnter={() => setActiveSubmenu(item.name)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <button
                      className={`flex items-center space-x-1 font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-gray-700 hover:text-primary'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 transition-all duration-200 ${
                        activeSubmenu === item.name
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{settings.contact_phone}</span>
            </a>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className={`lg:hidden pb-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <nav className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div className="border-b border-gray-100 pb-2">
                    <button
                      onClick={() =>
                        setActiveSubmenu(
                          activeSubmenu === item.name ? null : item.name
                        )
                      }
                      onTouchStart={(e) => {
                        e.preventDefault();
                        setActiveSubmenu(
                          activeSubmenu === item.name ? null : item.name
                        );
                      }}
                      className="flex items-center justify-between w-full py-3 text-gray-700 font-medium text-base"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          activeSubmenu === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      activeSubmenu === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pl-3 flex flex-col space-y-0">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="py-3 text-gray-600 hover:text-primary text-sm border-b border-gray-50 last:border-0"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setActiveSubmenu(null);
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="block py-3 text-gray-700 font-medium text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-3 rounded-lg mt-4"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{settings.contact_phone}</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
