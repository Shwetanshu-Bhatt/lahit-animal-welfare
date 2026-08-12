'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';

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
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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
    setSubmitting(true);

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
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this rescue story?')) return;
    setDeletingId(id);

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
    } finally {
      setDeletingId(null);
    }
  }

  async function togglePublish(rescue) {
    setTogglingId(rescue._id);
    const previousPublished = rescue.published;
    setRescues(prev => prev.map(r => 
      r._id === rescue._id ? { ...r, published: !rescue.published } : r
    ));

    try {
      const res = await fetch(`/api/rescues/${rescue._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !rescue.published })
      });
      const data = await res.json();
      
      if (!data.success) {
        setRescues(prev => prev.map(r => 
          r._id === rescue._id ? { ...r, published: previousPublished } : r
        ));
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      setRescues(prev => prev.map(r => 
        r._id === rescue._id ? { ...r, published: previousPublished } : r
      ));
    } finally {
      setTogglingId(null);
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
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Rescue Stories</h1>
        <Button 
          onClick={() => { resetForm(); setShowForm(true); }}
          variant="primary"
        >
          + Add New Rescue
        </Button>
      </div>

      {message.text && (
        <div className={`alert mb-6 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <span>{message.text}</span>
        </div>
      )}

      {showForm && (
        <div className="card bg-base-100 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-primary">
              {editingRescue ? 'Edit Rescue Story' : 'Add New Rescue Story'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Animal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Animal Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Cow">Cow</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Date</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    placeholder="e.g., January 2024"
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Before Image URL</label>
                  <input
                    type="text"
                    name="beforeImage"
                    value={formData.beforeImage}
                    onChange={handleChange}
                    required
                    placeholder="/images/rescue-before.jpg"
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">After Image URL</label>
                  <input
                    type="text"
                    name="afterImage"
                    value={formData.afterImage}
                    onChange={handleChange}
                    required
                    placeholder="/images/rescue-after.jpg"
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Story</label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="textarea textarea-bordered w-full"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                >
                  {editingRescue ? 'Update Rescue' : 'Add Rescue'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th className="text-primary">Before</th>
                <th className="text-primary">After</th>
                <th className="text-primary">Name</th>
                <th className="text-primary">Type</th>
                <th className="text-primary">Location</th>
                <th className="text-primary">Date</th>
                <th className="text-primary">Published</th>
                <th className="text-right text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rescues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-primary/60 py-8">
                    No rescue stories found. Add your first rescue story!
                  </td>
                </tr>
              ) : (
                rescues.map((rescue) => (
                  <tr key={rescue._id} className="hover:bg-base-200/50">
                    <td>
                      <div className="w-12 h-12 bg-base-300 rounded-lg overflow-hidden">
                        {rescue.beforeImage && (
                          <img src={rescue.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="w-12 h-12 bg-base-300 rounded-lg overflow-hidden">
                        {rescue.afterImage && (
                          <img src={rescue.afterImage} alt="After" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="font-medium text-primary">{rescue.name}</td>
                    <td className="text-primary/70">{rescue.type}</td>
                    <td className="text-primary/70">{rescue.location}</td>
                    <td className="text-primary/70">{rescue.date}</td>
                    <td>
                      <button
                        onClick={() => togglePublish(rescue)}
                        disabled={togglingId === rescue._id}
                        className={`btn btn-sm ${rescue.published ? 'btn-success' : 'btn-ghost'}`}
                      >
                        {togglingId === rescue._id ? '...' : rescue.published ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => editRescue(rescue)}
                          className="btn btn-sm btn-ghost text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rescue._id)}
                          disabled={deletingId === rescue._id}
                          className="btn btn-sm btn-ghost text-error"
                        >
                          {deletingId === rescue._id ? '...' : <Trash2 className="w-4 h-4" />}
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
    </div>
  );
}
