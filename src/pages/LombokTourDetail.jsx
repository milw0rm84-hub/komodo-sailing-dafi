import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mountain, Waves, CheckCircle, MessageCircle, Calendar } from 'lucide-react';
import { getPackage } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export default function LombokTourDetail() {
  const { settings } = useSettings();
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      try {
        const data = await getPackage(id);
        setPkg(data);
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const highlights = pkg?.highlights || [
    'Swim with sea turtles',
    '3 Gili Islands coverage',
    'All snorkeling equipment',
    'BBQ lunch on beach',
    'Glass bottom boat',
    'Professional instructor',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Package Not Found</h1>
          <Link to="/lombok-tour" className="btn-primary inline-block">Back to Lombok Tours</Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className="relative h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pkg.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <nav className="text-sm mb-4 opacity-80">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/lombok-tour" className="hover:text-primary">Lombok Tour</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{pkg.title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{pkg.title}</h1>
          <div className="flex items-center justify-center space-x-6 text-lg">
            <span className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {pkg.duration}
            </span>
            <span className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Lombok, Indonesia
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-heading font-bold mb-6">Tour Overview</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {pkg.description}
              </p>

              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6">Detailed Itinerary</h2>
                  <div className="space-y-6 mb-12">
                    {pkg.itinerary.map((day, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-dark font-bold mr-4">
                            {day.day}
                          </div>
                          <h3 className="text-xl font-semibold">{day.title}</h3>
                        </div>
                        <ul className="space-y-2 pl-14">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-600">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h2 className="text-2xl font-heading font-bold mb-6">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-gray-500 mb-1">Starting from</p>
                  <p className="text-4xl font-bold text-primary">{pkg.price}</p>
                  <p className="text-gray-500 text-sm">per person</p>
                </div>

                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hi, I'm interested in ${encodeURIComponent(pkg.title)} (${pkg.duration})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-secondary text-white font-semibold py-4 rounded-lg mb-4 hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </a>

                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold mb-4">Tour Info</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Mountain className="w-4 h-4 mr-3 text-primary" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-primary" />
                      <span>Lombok, Indonesia</span>
                    </div>
                    <div className="flex items-center">
                      <Waves className="w-4 h-4 mr-3 text-primary" />
                      <span>{pkg.location || 'Gili Islands'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-dark mb-4">
            Ready for Your Lombok Adventure?
          </h2>
          <p className="text-lg text-dark/80 mb-8">
            Book now and experience the beauty of Lombok!
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
