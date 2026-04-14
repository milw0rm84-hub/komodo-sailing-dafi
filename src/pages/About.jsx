import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Award, Heart, Globe, Star, Shield } from 'lucide-react';
import { getStats } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export default function About() {
  const { settings } = useSettings();
  const [stats, setStats] = useState([
    { number: '500+', label: 'Happy Guests' },
    { number: '10+', label: 'Tour Packages' },
    { number: '10+', label: 'Years Experience' },
    { number: '4.7/5', label: 'Customer Rating' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats([
          { number: `${data.guests}+`, label: 'Happy Guests' },
          { number: `${data.packages}+`, label: 'Tour Packages' },
          { number: '10+', label: 'Years Experience' },
          { number: `${data.rating}/5`, label: 'Customer Rating' },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Passion for Adventure',
      description: 'We are passionate about sharing the beauty of Komodo with the world and creating unforgettable experiences.',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority. All our boats are well-maintained and our crew is professionally trained.',
    },
    {
      icon: Globe,
      title: 'Sustainable Tourism',
      description: 'We are committed to preserving the natural beauty of Komodo National Park for future generations.',
    },
    {
      icon: Star,
      title: 'Quality Service',
      description: 'From booking to your return, we provide exceptional service at every step of your journey.',
    },
  ];

  const team = [
    {
      name: 'Risty Andini',
      role: 'Founder & Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    },
    {
      name: 'Ahmad Fauzi',
      role: 'Head Guide',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    },
    {
      name: 'Sari Dewi',
      role: 'Customer Service Lead',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    },
  ];

  return (
    <main>
      <section className="relative h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <nav className="text-sm mb-4 opacity-80">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">About Us</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About {settings.site_name}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {settings.site_description || 'Your trusted partner for unforgettable Komodo National Park adventures since 2014.'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">Our Story</span>
              <h2 className="text-3xl font-heading font-bold mt-2 mb-6">
                Trusted Komodo Sailing Adventure Agency
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Komodo Sailing Adventure was founded with a simple mission: to share the incredible beauty of Komodo National Park with travelers from around the world. What started as a small family operation has grown into one of the most trusted tour agencies in the region.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Based in Gili Trawangan, Lombok, we specialize in liveaboard cruise experiences that take you through the stunning islands of the Indonesian archipelago. From the iconic pink sands of Pink Beach to the majestic Komodo dragons, we ensure every moment of your journey is memorable.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of experienced guides, skilled captains, and dedicated support staff work tirelessly to provide safe, comfortable, and unforgettable adventures. Whether you're a solo traveler, a couple on your honeymoon, or a family looking for the trip of a lifetime, we have the perfect package for you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop"
                alt="Pink Beach"
                className="rounded-xl shadow-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=400&h=300&fit=crop"
                alt="Padar Island"
                className="rounded-xl shadow-lg w-full h-48 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
                alt="Boat"
                className="rounded-xl shadow-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop"
                alt="Snorkeling"
                className="rounded-xl shadow-lg w-full h-48 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Our Values</span>
            <h2 className="section-title mt-2">Why Choose Us</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Our Team</span>
            <h2 className="section-title mt-2">Meet the Team</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                />
                <h3 className="text-lg font-heading font-semibold">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-dark mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-dark/80 mb-8">
            Contact us today to plan your perfect Komodo cruise experience!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="bg-dark text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/komodo-tour"
              className="bg-white text-dark font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
            >
              View Tour Packages
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
