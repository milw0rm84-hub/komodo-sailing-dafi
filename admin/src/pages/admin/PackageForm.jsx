import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader
} from 'lucide-react';

export default function PackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    duration: '',
    location: '',
    description: '',
    image: '',
    gallery: [],
    itinerary: [{ day: 1, title: '', activities: [''] }],
    featured: false,
    status: 'active'
  });

  useEffect(() => {
    if (isEditing) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${id}`);
      setFormData(res.data);
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleActivityChange = (dayIndex, actIndex, value) => {
    const newItinerary = [...formData.itinerary];
    const activities = [...newItinerary[dayIndex].activities];
    activities[actIndex] = value;
    newItinerary[dayIndex].activities = activities;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addDay = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: formData.itinerary.length + 1, title: '', activities: [''] }
      ]
    });
  };

  const removeDay = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addActivity = (dayIndex) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities.push('');
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeActivity = (dayIndex, actIndex) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter((_, i) => i !== actIndex);
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleImageUpload = async (e, isGallery = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (isGallery) {
        setFormData({
          ...formData,
          gallery: [...formData.gallery, res.data.url]
        });
      } else {
        setFormData({ ...formData, image: res.data.url });
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanItinerary = formData.itinerary.map(day => ({
        ...day,
        activities: day.activities.filter(act => act.trim() !== '')
      })).filter(day => day.title.trim() !== '');

      const dataToSave = {
        ...formData,
        itinerary: cleanItinerary
      };

      if (isEditing) {
        await api.put(`/packages/${id}`, dataToSave);
      } else {
        await api.post('/packages', dataToSave);
      }

      navigate('/packages');
    } catch (error) {
      console.error('Save error:', error);
      alert(error.response?.data?.message || 'Error saving package');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slideIn">
      <div className="mb-6">
        <button
          onClick={() => navigate('/packages')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Packages
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Package' : 'Create New Package'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEditing ? 'Update package details' : 'Fill in the details to create a new tour package'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g. Lombok to Flores 3D2N Standard"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g. IDR 2,500,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g. 3D2N"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g. Lombok → Flores"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="input-field resize-none"
                placeholder="Describe the tour package..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Package</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Main Image</h2>
          
          <div className="flex items-start gap-4">
            <div className="w-64">
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-amber-600">
                <Loader className="w-5 h-5 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Gallery Images</h2>
          
          <div className="flex flex-wrap gap-4">
            {formData.gallery.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
              <Plus className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
            <button
              type="button"
              onClick={addDay}
              className="flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700"
            >
              <Plus className="w-4 h-4" />
              Add Day
            </button>
          </div>

          {formData.itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Day {day.day}</span>
                {formData.itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(dayIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input
                type="text"
                placeholder="Day title"
                value={day.title}
                onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                className="input-field"
              />

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Activities</label>
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Activity ${actIndex + 1}`}
                      value={activity}
                      onChange={(e) => handleActivityChange(dayIndex, actIndex, e.target.value)}
                      className="input-field"
                    />
                    {day.activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActivity(dayIndex, actIndex)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addActivity(dayIndex)}
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  + Add Activity
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/packages')}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Update Package' : 'Create Package'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
