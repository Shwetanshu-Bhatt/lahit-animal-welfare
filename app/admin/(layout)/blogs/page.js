'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Admin',
    category: 'General',
    tags: '',
    published: true,
    featured: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const res = await fetch('/api/blogs?all=true');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: editingBlog ? 'Blog updated successfully!' : 'Blog added successfully!' });
        fetchBlogs();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save blog.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving blog.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Blog deleted successfully!' });
        fetchBlogs();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete blog.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting blog.' });
    } finally {
      setDeletingId(null);
    }
  }

  async function togglePublish(blog) {
    setTogglingId(blog._id);
    const previousPublished = blog.published;
    setBlogs(prev => prev.map(b => 
      b._id === blog._id ? { ...b, published: !blog.published } : b
    ));

    try {
      const res = await fetch(`/api/blogs/${blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !blog.published })
      });
      const data = await res.json();
      
      if (!data.success) {
        setBlogs(prev => prev.map(b => 
          b._id === blog._id ? { ...b, published: previousPublished } : b
        ));
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      setBlogs(prev => prev.map(b => 
        b._id === blog._id ? { ...b, published: previousPublished } : b
      ));
    } finally {
      setTogglingId(null);
    }
  }

  function editBlog(blog) {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || '',
      author: blog.author || 'Admin',
      category: blog.category || 'General',
      tags: (blog.tags || []).join(', '),
      published: blog.published,
      featured: blog.featured || false
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      author: 'Admin',
      category: 'General',
      tags: '',
      published: true,
      featured: false
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
        <h1 className="text-3xl font-bold text-primary">Blog Posts</h1>
        <Button 
          onClick={() => { resetForm(); setShowForm(true); }}
          variant="primary"
          icon={FileText}
        >
          + Add New Post
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
              {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                    placeholder="Enter blog title"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="textarea textarea-bordered w-full"
                    placeholder="Short summary of the post"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="textarea textarea-bordered w-full"
                    placeholder="Full blog content (HTML supported)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="/images/blog-cover.jpg"
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
                    <option value="General">General</option>
                    <option value="Rescue Stories">Rescue Stories</option>
                    <option value="Medical Updates">Medical Updates</option>
                    <option value="Feeding Drives">Feeding Drives</option>
                    <option value="Adoption">Adoption</option>
                    <option value="Volunteer Events">Volunteer Events</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="rescue, dog, deharadun"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text ml-2">Published</span>
                </label>
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="checkbox checkbox-secondary"
                  />
                  <span className="label-text ml-2">Featured</span>
                </label>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                >
                  {editingBlog ? 'Update Post' : 'Add Post'}
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
                <th className="text-primary">Title</th>
                <th className="text-primary">Category</th>
                <th className="text-primary">Author</th>
                <th className="text-primary">Featured</th>
                <th className="text-primary">Published</th>
                <th className="text-primary">Date</th>
                <th className="text-right text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-primary/60 py-8">
                    No blog posts found. Add your first blog post!
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-base-200/50">
                    <td>
                      <div>
                        <p className="font-medium text-primary">{blog.title}</p>
                        <p className="text-xs text-primary/60 line-clamp-1">{blog.excerpt}</p>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary badge-outline">{blog.category}</span>
                    </td>
                    <td className="text-primary/70">{blog.author}</td>
                    <td>
                      {blog.featured ? (
                        <span className="badge badge-secondary">Featured</span>
                      ) : (
                        <span className="text-primary/40">-</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => togglePublish(blog)}
                        disabled={togglingId === blog._id}
                        className={`btn btn-sm ${blog.published ? 'btn-success' : 'btn-ghost'}`}
                      >
                        {togglingId === blog._id ? '...' : blog.published ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="text-primary/70 text-sm">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => editBlog(blog)}
                          className="btn btn-sm btn-ghost text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="btn btn-sm btn-ghost text-error"
                        >
                          {deletingId === blog._id ? '...' : <Trash2 className="w-4 h-4" />}
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
