'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    description: '',
    image: '',
    vaccinated: false,
    neutered: false,
    status: 'available',
    published: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      const res = await fetch('/api/animals?all=true');
      const data = await res.json();
      if (data.success) {
        setAnimals(data.data);
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
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
      const url = editingAnimal ? `/api/animals/${editingAnimal._id}` : '/api/animals';
      const method = editingAnimal ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: editingAnimal ? 'Animal updated successfully!' : 'Animal added successfully!' });
        fetchAnimals();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save animal.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving animal.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this animal?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/animals/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Animal deleted successfully!' });
        fetchAnimals();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete animal.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting animal.' });
    } finally {
      setDeletingId(null);
    }
  }

  async function togglePublish(animal) {
    setTogglingId(animal._id);
    const previousPublished = animal.published;
    setAnimals(prev => prev.map(a => 
      a._id === animal._id ? { ...a, published: !animal.published } : a
    ));

    try {
      const res = await fetch(`/api/animals/${animal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !animal.published })
      });
      const data = await res.json();
      
      if (!data.success) {
        setAnimals(prev => prev.map(a => 
          a._id === animal._id ? { ...a, published: previousPublished } : a
        ));
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      setAnimals(prev => prev.map(a => 
        a._id === animal._id ? { ...a, published: previousPublished } : a
      ));
    } finally {
      setTogglingId(null);
    }
  }

  function editAnimal(animal) {
    setEditingAnimal(animal);
    setFormData({
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      gender: animal.gender,
      description: animal.description,
      image: animal.image,
      vaccinated: animal.vaccinated,
      neutered: animal.neutered,
      status: animal.status,
      published: animal.published
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingAnimal(null);
    setFormData({
      name: '',
      type: 'Dog',
      breed: '',
      age: '',
      gender: 'Male',
      description: '',
      image: '',
      vaccinated: false,
      neutered: false,
      status: 'available',
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
        <h1 className="text-3xl font-bold text-primary">Animals for Adoption</h1>
        <Button 
          onClick={() => { resetForm(); setShowForm(true); }}
          variant="primary"
        >
          + Add New Animal
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
              {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Name</label>
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
                  <label className="block text-sm font-medium text-primary mb-2">Type</label>
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
                  <label className="block text-sm font-medium text-primary mb-2">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2 years"
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="available">Available</option>
                    <option value="adopted">Adopted</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    placeholder="/images/animal.jpg"
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="textarea textarea-bordered w-full"
                  />
                </div>
                
                <div className="flex items-center gap-6">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      name="vaccinated"
                      checked={formData.vaccinated}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text ml-2">Vaccinated</span>
                  </label>
                  
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      name="neutered"
                      checked={formData.neutered}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text ml-2">Neutered</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                >
                  {editingAnimal ? 'Update Animal' : 'Add Animal'}
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
                <th className="text-primary">Image</th>
                <th className="text-primary">Name</th>
                <th className="text-primary">Type</th>
                <th className="text-primary">Breed</th>
                <th className="text-primary">Status</th>
                <th className="text-primary">Published</th>
                <th className="text-right text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-primary/60 py-8">
                    No animals found. Add your first animal!
                  </td>
                </tr>
              ) : (
                animals.map((animal) => (
                  <tr key={animal._id} className="hover:bg-base-200/50">
                    <td>
                      <div className="w-12 h-12 bg-base-300 rounded-lg overflow-hidden">
                        {animal.image && (
                          <img src={animal.image} alt={animal.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="font-medium text-primary">{animal.name}</td>
                    <td className="text-primary/70">{animal.type}</td>
                    <td className="text-primary/70">{animal.breed}</td>
                    <td>
                      <span className={`badge badge-sm ${
                        animal.status === 'available' ? 'badge-success' :
                        animal.status === 'adopted' ? 'badge-primary' :
                        'badge-warning'
                      }`}>
                        {animal.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => togglePublish(animal)}
                        disabled={togglingId === animal._id}
                        className={`btn btn-sm ${animal.published ? 'btn-success' : 'btn-ghost'}`}
                      >
                        {togglingId === animal._id ? '...' : animal.published ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => editAnimal(animal)}
                          className="btn btn-sm btn-ghost text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(animal._id)}
                          disabled={deletingId === animal._id}
                          className="btn btn-sm btn-ghost text-error"
                        >
                          {deletingId === animal._id ? '...' : <Trash2 className="w-4 h-4" />}
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
