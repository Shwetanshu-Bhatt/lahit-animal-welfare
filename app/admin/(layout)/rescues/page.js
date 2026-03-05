'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';

export default function AdminRescues() {
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRescue, setEditingRescue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    location: '',
    beforeImage: '',
    afterImage: '',
    story: '',
    date: '',
    published: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRescues();
  }, []);

  async function fetchRescues() {
    try {
      const res = await fetch('/api/rescues?all=true');
      const data = await res.json();
      if (data.success) {
        setRescues(data.data);
      }
    } catch (error) {
      console.error('Error fetching rescues:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const url = editingRescue ? `/api/rescues/${editingRescue._id}` : '/api/rescues';
      const method = editingRescue ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: editingRescue ? 'Rescue updated successfully!' : 'Rescue added successfully!' });
        fetchRescues();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save rescue.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving rescue.' });
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this rescue story?')) return;

    try {
      const res = await fetch(`/api/rescues/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Rescue deleted successfully!' });
        fetchRescues();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete rescue.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting rescue.' });
    }
  }

  async function togglePublish(rescue) {
    try {
      const res = await fetch(`/api/rescues/${rescue._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !rescue.published })
      });
      const data = await res.json();
      
      if (data.success) {
        fetchRescues();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  }

  function editRescue(rescue) {
    setEditingRescue(rescue);
    setFormData({
      name: rescue.name,
      type: rescue.type,
      location: rescue.location,
      beforeImage: rescue.beforeImage,
      afterImage: rescue.afterImage,
      story: rescue.story,
      date: rescue.date,
      published: rescue.published
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingRescue(null);
    setFormData({
      name: '',
      type: 'Dog',
      location: '',
      beforeImage: '',
      afterImage: '',
      story: '',
      date: '',
      published: true
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#401E01]">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#401E01]">Rescue Stories</h1>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#164020] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d2b16] transition-colors"
        >
          + Add New Rescue
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-[#401E01] mb-6">
            {editingRescue ? 'Edit Rescue Story' : 'Add New Rescue Story'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Animal Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Animal Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Cow">Cow</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Date</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  placeholder="e.g., January 2024"
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Before Image URL</label>
                <input
                  type="text"
                  name="beforeImage"
                  value={formData.beforeImage}
                  onChange={handleChange}
                  required
                  placeholder="/images/rescue-before.jpg"
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">After Image URL</label>
                <input
                  type="text"
                  name="afterImage"
                  value={formData.afterImage}
                  onChange={handleChange}
                  required
                  placeholder="/images/rescue-after.jpg"
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#401E01] mb-2">Story</label>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                className="bg-[#164020] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0d2b16] transition-colors"
              >
                {editingRescue ? 'Update Rescue' : 'Add Rescue'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-[#401E01] px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#401E01]/5">
            <tr>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Before</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">After</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Name</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Type</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Location</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Date</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Published</th>
              <th className="text-right px-6 py-4 text-[#401E01] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rescues.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-[#401E01]/60">
                  No rescue stories found. Add your first rescue story!
                </td>
              </tr>
            ) : (
              rescues.map((rescue) => (
                <tr key={rescue._id} className="border-t border-[#401E01]/10">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-[#401E01]/10 rounded-lg overflow-hidden">
                      {rescue.beforeImage && (
                        <img src={rescue.beforeImage} alt="Before" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-[#401E01]/10 rounded-lg overflow-hidden">
                      {rescue.afterImage && (
                        <img src={rescue.afterImage} alt="After" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#401E01]">{rescue.name}</td>
                  <td className="px-6 py-4 text-[#401E01]/70">{rescue.type}</td>
                  <td className="px-6 py-4 text-[#401E01]/70">{rescue.location}</td>
                  <td className="px-6 py-4 text-[#401E01]/70">{rescue.date}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(rescue)}
                      className={`p-2 rounded-lg ${rescue.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {rescue.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editRescue(rescue)}
                        className="p-2 bg-[#164020]/10 text-[#164020] rounded-lg hover:bg-[#164020]/20"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rescue._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
