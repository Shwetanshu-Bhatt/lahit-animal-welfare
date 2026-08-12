'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Copy, Check, Image as ImageIcon, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    filename: '',
    url: '',
    type: 'image',
    category: 'general',
    alt: '',
    caption: '',
    uploadedBy: 'Admin'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) {
        setMedia(data.data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      const url = editingMedia ? `/api/media/${editingMedia._id}` : '/api/media';
      const method = editingMedia ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: editingMedia ? 'Media updated successfully!' : 'Media added successfully!' });
        fetchMedia();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save media.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving media.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this media?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Media deleted successfully!' });
        fetchMedia();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete media.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting media.' });
    } finally {
      setDeletingId(null);
    }
  }

  function editMedia(item) {
    setEditingMedia(item);
    setFormData({
      filename: item.filename,
      url: item.url,
      type: item.type,
      category: item.category,
      alt: item.alt || '',
      caption: item.caption || '',
      uploadedBy: item.uploadedBy || 'Admin'
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingMedia(null);
    setFormData({
      filename: '',
      url: '',
      type: 'image',
      category: 'general',
      alt: '',
      caption: '',
      uploadedBy: 'Admin'
    });
  }

  function copyToClipboard(text, id) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.caption || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-primary">Media Library</h1>
        <Button 
          onClick={() => { resetForm(); setShowForm(true); }}
          variant="primary"
          icon={ImageIcon}
        >
          + Add Media
        </Button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-success/10 text-success-content' 
            : 'bg-error/10 text-error-content'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="card bg-base-100 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-primary">
              {editingMedia ? 'Edit Media' : 'Add New Media'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Filename</label>
                  <input
                    type="text"
                    name="filename"
                    value={formData.filename}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                    placeholder="hero-dog.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">URL</label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                    placeholder="https://... or /images/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="general">General</option>
                    <option value="rescue">Rescue</option>
                    <option value="animal">Animal</option>
                    <option value="event">Event</option>
                    <option value="blog">Blog</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Alt Text</label>
                  <input
                    type="text"
                    name="alt"
                    value={formData.alt}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Image description"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Caption</label>
                  <input
                    type="text"
                    name="caption"
                    value={formData.caption}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Optional caption"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                >
                  {editingMedia ? 'Update Media' : 'Add Media'}
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

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="form-control flex-1">
              <div className="input input-bordered flex items-center gap-2">
                <Search className="w-4 h-4 text-primary/60" />
                <input
                  type="text"
                  placeholder="Search media..."
                  className="grow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <select
              className="select select-bordered"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="rescue">Rescue</option>
              <option value="animal">Animal</option>
              <option value="event">Event</option>
              <option value="blog">Blog</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.length === 0 ? (
              <div className="col-span-full text-center text-primary/60 py-12">
                No media found. Add your first media item!
              </div>
            ) : (
              filteredMedia.map((item) => (
                <div key={item._id} className="card bg-base-200 shadow-sm">
                  <div className="aspect-square bg-base-300 relative">
                    {item.type === 'image' ? (
                      <Image src={item.url} alt={item.alt || item.filename} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 badge badge-primary badge-sm">
                      {item.type}
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <p className="text-sm font-medium text-primary truncate">{item.filename}</p>
                    <p className="text-xs text-primary/60 capitalize">{item.category}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <input
                        type="text"
                        readOnly
                        value={item.url}
                        className="input input-xs input-bordered flex-1 text-xs"
                      />
                      <button
                        onClick={() => copyToClipboard(item.url, item._id)}
                        className="btn btn-xs btn-ghost"
                      >
                        {copiedId === item._id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => editMedia(item)}
                        className="btn btn-xs btn-ghost flex-1 text-primary"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        className="btn btn-xs btn-ghost text-error"
                      >
                        {deletingId === item._id ? '...' : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
