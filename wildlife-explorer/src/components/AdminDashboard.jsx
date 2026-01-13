import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Image, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [animals, setAnimals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'mammals', image: null, facts: '', habitat: '',
    diet: 'carnivore', description: '', conservationStatus: 'LC'
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/animals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData.image) {
        formDataToSend.append(key, formData.image);
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `/api/admin/animals/${editingId}`
        : '/api/admin/animals';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          name: '', category: 'mammals', image: null, facts: '', habitat: '',
          diet: 'carnivore', description: '', conservationStatus: 'LC'
        });
        setEditingId(null);
        fetchAnimals();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (animal) => {
    setFormData({
      name: animal.name,
      category: animal.category,
      image: animal.image,
      facts: animal.facts || '',
      habitat: animal.habitat,
      diet: animal.diet,
      description: animal.description,
      conservationStatus: animal.conservationStatus
    });
    setEditingId(animal._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this animal?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/animals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnimals();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-22">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12 ">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage wildlife species database</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'Add Animal'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl p-12 shadow-2xl mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">
            {editingId ? 'Edit Animal' : 'Add New Animal'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="mammals">Mammals</option>
                <option value="birds">Birds</option>
                <option value="reptiles">Reptiles</option>
                <option value="amphibians">Amphibians</option>
                <option value="fish">Fish</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="hidden"
                  id="image-upload"
                  required={!editingId}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Image size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-700">
                    {formData.image?.name || editingId ? formData.image : 'Click to upload image'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Short Facts</label>
              <textarea
                value={formData.facts}
                onChange={(e) => setFormData({ ...formData, facts: e.target.value })}
                rows={3}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 resize-vertical"
                placeholder="Interesting fact about this animal..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Habitat *</label>
              <input
                type="text"
                value={formData.habitat}
                onChange={(e) => setFormData({ ...formData, habitat: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Diet *</label>
              <select
                value={formData.diet}
                onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="carnivore">Carnivore</option>
                <option value="herbivore">Herbivore</option>
                <option value="omnivore">Omnivore</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 resize-vertical"
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Animal' : 'Add Animal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '', category: 'mammals', image: null, facts: '', habitat: '',
                    diet: 'carnivore', description: '', conservationStatus: 'LC'
                  });
                }}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Animals Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search animals..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => {
                // Add search functionality
              }}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-3 bg-green-100 text-green-800 rounded-xl font-medium hover:bg-green-200">
              All
            </button>
            <button className="px-4 py-3 bg-blue-100 text-blue-800 rounded-xl font-medium hover:bg-blue-200">
              Mammals
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 font-semibold text-gray-800">Image</th>
                <th className="text-left py-4 font-semibold text-gray-800">Name</th>
                <th className="text-left py-4 font-semibold text-gray-800 hidden md:table-cell">Category</th>
                <th className="text-left py-4 font-semibold text-gray-800 hidden lg:table-cell">Habitat</th>
                <th className="text-left py-4 font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <img src={animal.image} alt={animal.name} className="w-16 h-16 rounded-xl object-cover" />
                  </td>
                  <td className="py-4 font-semibold text-gray-900">{animal.name}</td>
                  <td className="py-4 hidden md:table-cell">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {animal.category}
                    </span>
                  </td>
                  <td className="py-4 hidden lg:table-cell">{animal.habitat}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(animal)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(animal._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
