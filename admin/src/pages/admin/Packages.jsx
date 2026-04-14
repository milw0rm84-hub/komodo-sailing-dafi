import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image,
  Star,
  Eye,
  EyeOff,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages');
      setPackages(res.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/packages/${deleteId}`);
      setPackages(packages.filter(pkg => pkg.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting package:', error);
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (pkg) => {
    try {
      const res = await api.put(`/packages/${pkg.id}`, { featured: !pkg.featured });
      setPackages(packages.map(p => p.id === pkg.id ? res.data : p));
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const toggleStatus = async (pkg) => {
    try {
      const newStatus = pkg.status === 'active' ? 'inactive' : 'active';
      const res = await api.put(`/packages/${pkg.id}`, { status: newStatus });
      setPackages(packages.map(p => p.id === pkg.id ? res.data : p));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(search.toLowerCase()) ||
    pkg.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Packages</h1>
          <p className="text-gray-500 mt-1">Manage your tour packages</p>
        </div>
        <Link to="/packages/new" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-5 h-5" />
          Add Package
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4 text-left">Package</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Duration</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{pkg.title}</p>
                          <p className="text-sm text-gray-500">{pkg.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{pkg.location}</td>
                    <td className="px-6 py-4 text-gray-600">{pkg.duration}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{pkg.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(pkg)}
                        className={`status-badge ${pkg.status === 'active' ? 'status-approved' : 'status-cancelled'}`}
                      >
                        {pkg.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(pkg)}
                        className={`p-2 rounded-lg transition-colors ${
                          pkg.featured
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${pkg.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/packages/edit/${pkg.id}`}
                          className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(pkg.id)}
                          className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    {search ? 'No packages found matching your search.' : 'No packages yet. Create your first package!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slideIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Package</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this package? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 btn-danger"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
