import { Link } from 'react-router-dom';
import { MapPin, Mountain, Waves, ArrowRight, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPackages } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export default function LombokTour() {
  const { settings } = useSettings();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackages({ status: 'active' });
        const lombokPackages = data.filter(pkg => 
          pkg.slug === 'snorkeling' || 
          pkg.slug === 'rinjani-trekking'
        );
        setPackages(lombokPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const lombokPackages = packages.length > 0 ? packages : [
    {
      id: 'rinjani-trekking',
      slug: 'rinjani-trekking',
      title: 'Mount Rinjani Trekking Packages',
      subtitle: 'Conquer Indonesia\'s Second Highest Volcano',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
      description: 'Experience the adventure of a lifetime trekking to the summit of Mount Rinjani. This 3,726-meter volcano offers breathtaking views, stunning crater lakes, and an unforgettable sunrise.',
      highlights: [
        'Summit at 3,726 meters',
        'Crater Lake view',
        'Hot springs',
        'Exotic wildlife',
        'Professional mountain guide',
        'All camping equipment included',
      ],
      duration: '2-4 Days',
      difficulty: 'Moderate to Hard',
      price: 'From IDR 2,200,000',
    },
    {
      id: 'snorkeling',
      slug: 'snorkeling',
      title: 'Snorkeling Tour Gili Trawangan',
      subtitle: 'Crystal Clear Waters of the Gili Islands',
      image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&h=500&fit=crop',
      description: 'Explore the underwater paradise of the Gili Islands. Swim with sea turtles, discover colorful coral reefs, and enjoy the pristine beaches of Gili Trawangan, Gili Air, and Gili Meno.',
      highlights: [
        'Swim with sea turtles',
        '3 Gili Islands coverage',
        'All snorkeling equipment',
        'BBQ lunch on beach',
        'Glass bottom boat',
        'Professional instructor',
      ],
      duration: 'Full Day',
      difficulty: 'Easy',
      price: 'From IDR 750,000',
    },
  ];

  return (
    <main>
      <section className="relative h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&h=1080&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <nav className="text-sm mb-4 opacity-80">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">Lombok Tour</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Lombok Tour Packages</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Discover the natural beauty of Lombok beyond Komodo. From mountain trekking to island snorkeling.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {lombokPackages.map((pkg, index) => (
                <div
                  key={pkg.id || pkg.slug}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="rounded-xl shadow-xl w-full h-[400px] object-cover"
                    />
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                      {pkg.subtitle}
                    </span>
                    <h2 className="text-3xl font-heading font-bold mt-2 mb-4">{pkg.title}</h2>
                    <p className="text-gray-600 mb-6">{pkg.description}</p>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <span className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm">
                        <Mountain className="w-4 h-4 mr-2 text-primary" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        Lombok, Indonesia
                      </span>
                    </div>

                    <h3 className="font-semibold mb-3">Highlights:</h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {(pkg.highlights || []).map((highlight, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t">
                      <div>
                        <span className="text-gray-500 text-sm">Starting from</span>
                        <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                      </div>
                      <a
                        href={`https://wa.me/${settings.whatsapp}?text=Hi, I'm interested in ${encodeURIComponent(pkg.title)}`}
                        className="btn-primary flex items-center"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-dark mb-4">
            Want to Combine Lombok & Komodo Tours?
          </h2>
          <p className="text-lg text-dark/80 mb-8">
            We offer combined packages that include both Lombok adventures and Komodo cruises!
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-dark text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
          >
            Contact Us for Custom Packages
          </Link>
        </div>
      </section>
    </main>
  );
}
