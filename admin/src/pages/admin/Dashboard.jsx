import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  Package,
  Calendar,
  Star,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Packages',
      value: stats?.totalPackages || 0,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      link: '/packages'
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      link: '/bookings'
    },
    {
      label: 'Approved Reviews',
      value: stats?.totalReviews || 0,
      icon: Star,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      link: '/reviews'
    },
    {
      label: 'Pending Bookings',
      value: stats?.pendingBookings || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      link: '/bookings?status=pending'
    }
  ];

  return (
    <div className="space-y-6 animate-slideIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {stats?.pendingBookings > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-800">
            You have <strong>{stats.pendingBookings}</strong> pending booking{stats.pendingBookings > 1 ? 's' : ''} that need{stats.pendingBookings === 1 ? 's' : ''} attention.
          </p>
          <Link to="/bookings?status=pending" className="ml-auto text-yellow-700 font-medium hover:underline">
            View →
          </Link>
        </div>
      )}

      {stats?.pendingReviews > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800">
            You have <strong>{stats.pendingReviews}</strong> review{stats.pendingReviews > 1 ? 's' : ''} waiting for moderation.
          </p>
          <Link to="/reviews?status=pending" className="ml-auto text-amber-700 font-medium hover:underline">
            Review →
          </Link>
        </div>
      )}

      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Package</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <tr key={booking.id} className="table-row">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-500">{booking.whatsapp}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{booking.packageName}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(booking.travelDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No recent bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {stats?.recentBookings?.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <Link to="/bookings" className="text-amber-600 font-medium hover:text-amber-700">
              View all bookings →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
