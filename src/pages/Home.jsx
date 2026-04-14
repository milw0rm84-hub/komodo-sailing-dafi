import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, ArrowRight, Anchor, Wallet, Ship, Headphones, MapPin, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPackages, getApprovedReviews, getGallery, getBlogPosts } from '../utils/api';
import { whyChooseUs } from '../data/tourData';
import { useSettings } from '../context/SettingsContext';

function PackageCard({ pkg }) {
  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img
          src={pkg.image || 'https://via.placeholder.com/600x400?text=No+Image'}
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
          <span className="text-primary font-bold text-lg">{pkg.price}</span>
          <Link
            to={`/komodo-tour/${pkg.slug}`}
            className="flex items-center text-dark font-medium hover:text-primary transition-colors"
          >
            More Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-5 h-5 ${i < (review.rating || 5) ? 'text-primary fill-current' : 'text-gray-600'}`} />
        ))}
      </div>
      <p className="text-lg mb-6 italic">"{review.comment}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
          <span className="text-xl font-semibold text-primary">{review.name?.charAt(0) || 'G'}</span>
        </div>
        <div>
          <h4 className="font-semibold">{review.name}</h4>
          <p className="text-gray-400 text-sm">Verified Guest</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { settings } = useSettings();
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesData, reviewsData, galleryData, blogData] = await Promise.all([
        getPackages({ status: 'active' }),
        getApprovedReviews(),
        getGallery(),
        getBlogPosts()
      ]);
      setPackages(packagesData);
      setReviews(reviewsData);
      setGallery(galleryData);
      setBlogPosts(blogData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (reviews.length || 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (reviews.length || 1)) % (reviews.length || 1));
  };

  const displayPackages = packages.filter(pkg => pkg.status === 'active' || !pkg.status);
  const lombokFloresPackages = displayPackages.filter(pkg => 
    pkg.location?.toLowerCase().includes('lombok') || pkg.location?.toLowerCase().includes('flores')
  );
  const labuanPackages = displayPackages.filter(pkg => 
    pkg.location?.toLowerCase().includes('labuan') || 
    pkg.duration?.toLowerCase().includes('day') ||
    (!pkg.location?.toLowerCase().includes('lombok') && !pkg.location?.toLowerCase().includes('flores'))
  );

  const iconMap = {
    anchor: Anchor,
    wallet: Wallet,
    ship: Ship,
    headphones: Headphones,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main>
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: settings.hero_image 
              ? `url(${settings.hero_image})` 
              : 'url(https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight">
            {settings.seo?.title || 'Trusted Komodo Sailing Adventure Agency'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto line-clamp-3 sm:line-clamp-none">
            {settings.seo?.description || settings.site_description || 'Explore the breathtaking beauty of Komodo National Park with our trusted liveaboard boats.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href={`https://wa.me/${settings.whatsapp}`} className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
              Book Now
            </a>
            <a href="#packages" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
              Explore More
            </a>
          </div>
        </div>
      </section>

      <section id="packages" className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Our Packages</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mt-2 text-gray-900">
              Best Komodo Boat Trip Packages<br className="hidden sm:block" /> Lombok - Flores Routes
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4 mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Discover our carefully curated cruise packages taking you through the stunning islands of Komodo National Park.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : lombokFloresPackages.length > 0 ? (
              lombokFloresPackages.slice(0, 6).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No packages available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Labuan Bajo</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mt-2 text-gray-900">
              Sailing Package Labuan Bajo to<br className="hidden sm:block" /> Komodo National Park
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : labuanPackages.length > 0 ? (
              labuanPackages.slice(0, 6).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No day trip packages available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Why Us</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mt-2">
              Get Adventure Experience
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4 mb-4" />
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Experience the best of Komodo with our professional team, quality boats, and unforgettable adventures.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              return (
                <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center hover:bg-gray-700 transition-colors">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mt-2 text-gray-900">
                What Our Guests Say
              </h2>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4" />
            </div>

            <div className="relative max-w-3xl mx-auto px-4 sm:px-0">
              <ReviewCard review={reviews[currentSlide]} />

              <div className="flex justify-center mt-6 sm:mt-8 space-x-4">
                <button onClick={prevSlide} className="p-2 sm:p-3 bg-gray-800 rounded-full hover:bg-primary hover:text-dark transition-colors">
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button onClick={nextSlide} className="p-2 sm:p-3 bg-gray-800 rounded-full hover:bg-primary hover:text-dark transition-colors">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Gallery</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mt-2 text-gray-900">
              Highlight Destination Komodo Sailing Adventure
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4 mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4 hidden sm:block">
              Discover the stunning beauty of Komodo National Park's most iconic destinations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : gallery.length > 0 ? (
              gallery.slice(0, 12).map((img) => (
                <div key={img.id} className="relative group overflow-hidden rounded-lg sm:rounded-xl aspect-square">
                  <img
                    src={img.url}
                    alt={img.caption || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {img.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  {img.caption && (
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-white text-xs sm:text-sm font-semibold">{img.caption}</h4>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                Gallery coming soon.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Blog</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mt-2 text-gray-900">
              Find Information on Our Blog
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : blogPosts.length > 0 ? (
              blogPosts.slice(0, 4).map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} className="card group">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={post.title}
                      className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-dark text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                      {post.category || 'Article'}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-heading font-semibold mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{post.excerpt}</p>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {formatDate(post.created_at)} · {post.read_time || 5} min read
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                Blog posts coming soon.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-dark mb-3 sm:mb-4">
            Ready for Your Komodo Adventure?
          </h2>
          <p className="text-base sm:text-lg text-dark/80 mb-6 sm:mb-8">
            Book now and experience the trip of a lifetime in Komodo National Park!
          </p>
          <a href={`https://wa.me/${settings.whatsapp}`} className="inline-flex items-center bg-dark text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-colors">
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Trip Now
          </a>
        </div>
      </section>
    </main>
  );
}
