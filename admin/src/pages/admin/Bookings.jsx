import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  ChevronDown
} from 'lucide-react';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' }
];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      const res = await api.get(`/bookings?${params.toString()}`);
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/bookings/${id}`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? res.data : b));
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setUpdating(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
    booking.email.toLowerCase().includes(search.toLowerCase()) ||
    booking.whatsapp.includes(search)
  );

  const getStatusBadge = (status) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">Manage customer bookings and reservations</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field sm:w-48"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Package</th>
                <th className="px-6 py-4 text-left">Travel Date</th>
                <th className="px-6 py-4 text-left">Guests</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="table-row">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-500">{booking.email}</p>
                        <p className="text-sm text-gray-500">{booking.whatsapp}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{booking.packageName}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(booking.travelDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{booking.numberOfGuests}</td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <a
                          href={`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {search || status ? 'No bookings found matching your criteria.' : 'No bookings yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium text-gray-900">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="text-gray-900">{selectedBooking.whatsapp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="text-gray-900">{selectedBooking.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="text-gray-900">
                    {new Date(selectedBooking.travelDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Guests</p>
                  <p className="text-gray-900">{selectedBooking.numberOfGuests}</p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span className={getStatusBadge(selectedBooking.status)}>
                  {selectedBooking.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(selectedBooking._id, 'confirmed')}
                    disabled={updating || selectedBooking.status === 'confirmed'}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(selectedBooking._id, 'cancelled')}
                    disabled={updating || selectedBooking.status === 'cancelled'}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={() => updateStatus(selectedBooking._id, 'completed')}
                    disabled={updating || selectedBooking.status === 'completed'}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t flex justify-between">
              <a
                href={`https://wa.me/${selectedBooking.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
