import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, CheckCircle, Star, ArrowRight, MessageCircle, Send, Check } from 'lucide-react';
import { getPackage, createBooking } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export default function TourDetail() {
  const { settings } = useSettings();
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [booking, setBooking] = useState({
    customerName: '',
    email: '',
    whatsapp: '',
    travelDate: '',
    numberOfGuests: 1,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      try {
        const data = await getPackage(id);
        setTour(data);
      } catch (err) {
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setError('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await createBooking({
        customerName: booking.customerName,
        email: booking.email,
        whatsapp: booking.whatsapp,
        packageId: tour.id,
        packageName: tour.title,
        travelDate: booking.travelDate,
        numberOfGuests: parseInt(booking.numberOfGuests),
        notes: booking.notes
      });
      setBookingSuccess(true);
      setBooking({
        customerName: '',
        email: '',
        whatsapp: '',
        travelDate: '',
        numberOfGuests: 1,
        notes: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Tour Package Not Found</h1>
          <Link to="/" className="btn-primary inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const highlights = [
    'Visit Komodo National Park',
    'Explore Padar Island viewpoint',
    'Snorkeling at world-class spots',
    'Swim with manta rays',
    'See Pink Beach',
    'Sunset sailing experience',
  ];

  return (
    <main>
      <section className="relative h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${tour.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <nav className="text-sm mb-4 opacity-80">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/komodo-tour" className="hover:text-primary">Komodo Tour</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{tour.title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{tour.title}</h1>
          <div className="flex items-center justify-center space-x-6 text-lg">
            <span className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {tour.duration}
            </span>
            <span className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {tour.location}
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
                {tour.description}
              </p>

              {tour.gallery && tour.gallery.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold mb-6">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tour.gallery.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-heading font-bold mb-6">Tour Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {tour.itinerary && tour.itinerary.length > 0 && (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6">Detailed Itinerary</h2>
                  <div className="space-y-6 mb-12">
                    {tour.itinerary.map((day) => (
                      <div key={day.day} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-dark font-bold mr-4">
                            {day.day}
                          </div>
                          <h3 className="text-xl font-semibold">{day.title}</h3>
                        </div>
                        <ul className="space-y-2 pl-14">
                          {day.activities.map((activity, index) => (
                            <li key={index} className="flex items-start">
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
                {[
                  'All meals during the trip',
                  'Accommodation on boat',
                  'Professional guide',
                  'Snorkeling equipment',
                  'All park fees',
                  'Transfer to/from boat',
                  'Drinking water & coffee',
                  'Travel insurance',
                ].map((item, index) => (
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
                  <p className="text-4xl font-bold text-primary">{tour.price}</p>
                  <p className="text-gray-500 text-sm">per person</p>
                </div>

                <div className="flex items-center justify-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-current" />
                  ))}
                </div>
                <p className="text-center text-gray-600 mb-6">
                  Based on 50+ reviews
                </p>

                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hi, I'm interested in ${encodeURIComponent(tour.title)} (${tour.duration})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-secondary text-white font-semibold py-4 rounded-lg mb-4 hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </a>

                <button
                  onClick={() => setShowBookingForm(!showBookingForm)}
                  className="w-full flex items-center justify-center border-2 border-primary text-primary font-semibold py-4 rounded-lg hover:bg-primary hover:text-dark transition-colors"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {showBookingForm ? 'Close Form' : 'Send Booking Inquiry'}
                </button>

                {showBookingForm && (
                  <div className="mt-6 pt-6 border-t">
                    {bookingSuccess ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Booking Submitted!</h3>
                        <p className="text-gray-600 mb-4">We'll contact you shortly via WhatsApp.</p>
                        <button
                          onClick={() => {
                            setBookingSuccess(false);
                            setShowBookingForm(false);
                          }}
                          className="btn-primary"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <h3 className="font-semibold mb-2">Booking Inquiry</h3>
                        
                        {error && (
                          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                            {error}
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium mb-1">Your Name *</label>
                          <input
                            type="text"
                            name="customerName"
                            value={booking.customerName}
                            onChange={handleBookingChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={booking.email}
                            onChange={handleBookingChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">WhatsApp *</label>
                          <input
                            type="tel"
                            name="whatsapp"
                            value={booking.whatsapp}
                            onChange={handleBookingChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="+62 812 xxxx xxxx"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Travel Date *</label>
                          <input
                            type="date"
                            name="travelDate"
                            value={booking.travelDate}
                            onChange={handleBookingChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Number of Guests</label>
                          <input
                            type="number"
                            name="numberOfGuests"
                            value={booking.numberOfGuests}
                            onChange={handleBookingChange}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Notes</label>
                          <textarea
                            name="notes"
                            value={booking.notes}
                            onChange={handleBookingChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            placeholder="Any special requests..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full btn-primary disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : 'Submit Booking'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold mb-4">Share this tour:</h4>
                  <div className="flex space-x-3">
                    <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                      f
                    </button>
                    <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600">
                      t
                    </button>
                    <button className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700">
                      p
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">
            Ready for Your Komodo Adventure?
          </h2>
          <p className="text-lg text-dark/80 mb-8">
            Book now and experience the trip of a lifetime!
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
