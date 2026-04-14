import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPackages } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export default function KomodoTour() {
  const { settings } = useSettings();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getPackages({ status: 'active' });
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const lombokFloresPackages = packages.filter(pkg => 
    pkg.location?.toLowerCase().includes('lombok') || pkg.location?.toLowerCase().includes('flores')
  );
  const labuanPackages = packages.filter(pkg => 
    pkg.location?.toLowerCase().includes('labuan') || pkg.duration?.toLowerCase().includes('day')
  );

  return (
    <main>
      <section className="relative h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <nav className="text-sm mb-4 opacity-80">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">Komodo Tour</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Komodo Tour Packages</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Choose from our range of carefully curated Komodo cruise packages. From budget-friendly to luxury experiences.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Our Packages</span>
            <h2 className="section-title mt-2">Lombok - Flores Routes</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : lombokFloresPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {lombokFloresPackages.map((pkg) => (
                <div key={pkg.slug} className="card group">
                  <div className="relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-dark text-sm font-semibold px-3 py-1 rounded-full">
                      {pkg.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{pkg.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                      </div>
                      <Link
                        to={`/komodo-tour/${pkg.slug}`}
                        className="flex items-center text-dark font-medium hover:text-primary transition-colors"
                      >
                        Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 mb-16">
              No Lombok-Flores packages available at the moment.
            </div>
          )}

          <div className="text-center mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Alternative Routes</span>
            <h2 className="section-title mt-2">Labuan Bajo Packages</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : labuanPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {labuanPackages.map((pkg) => (
                <div key={pkg.slug} className="card group">
                  <div className="relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-dark text-sm font-semibold px-3 py-1 rounded-full">
                      {pkg.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{pkg.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                      </div>
                      <Link
                        to={`/komodo-tour/${pkg.slug}`}
                        className="flex items-center text-dark font-medium hover:text-primary transition-colors"
                      >
                        Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No Labuan Bajo packages available at the moment.
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-dark fill-current" />
            ))}
          </div>
          <h2 className="text-3xl font-heading font-bold text-dark mb-4">
            Need Help Choosing the Right Tour?
          </h2>
          <p className="text-lg text-dark/80 mb-8">
            Contact us and we'll help you find the perfect Komodo adventure!
          </p>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            className="inline-flex items-center bg-dark text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Trip Now
          </a>
        </div>
      </section>
    </main>
  );
}
