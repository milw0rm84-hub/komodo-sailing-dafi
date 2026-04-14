import axios from 'axios';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getPackages = async (params = {}) => {
  const response = await api.get('/packages', { params });
  return response.data;
};

export const getPackage = async (id) => {
  const response = await api.get(`/packages/${id}`);
  return response.data;
};

export const getPackageBySlug = async (slug) => {
  const response = await api.get(`/packages/slug/${slug}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getApprovedReviews = async () => {
  const response = await api.get('/reviews/approved');
  return response.data;
};

export const getGallery = async () => {
  const response = await api.get('/gallery');
  return response.data;
};

export const getBlogPosts = async (params = {}) => {
  const response = await api.get('/blog', { params: { ...params, status: 'published' } });
  return response.data;
};

export const getBlogPost = async (id) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export const getBlogPostBySlug = async (slug) => {
  const response = await api.get(`/blog/slug/${slug}`);
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats/public');
  return response.data;
};

export default api;
