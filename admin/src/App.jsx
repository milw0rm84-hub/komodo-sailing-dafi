import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/admin/Layout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Packages from './pages/admin/Packages';
import PackageForm from './pages/admin/PackageForm';
import Bookings from './pages/admin/Bookings';
import Reviews from './pages/admin/Reviews';
import Gallery from './pages/admin/Gallery';
import Blog from './pages/admin/Blog';
import BlogForm from './pages/admin/BlogForm';
import Settings from './pages/admin/Settings';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/new" element={<PackageForm />} />
        <Route path="packages/edit/:id" element={<PackageForm />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/new" element={<BlogForm />} />
        <Route path="blog/edit/:id" element={<BlogForm />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
