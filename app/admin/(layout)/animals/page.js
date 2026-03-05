'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';

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
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this animal?')) return;

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
    }
  }

  async function togglePublish(animal) {
    try {
      const res = await fetch(`/api/animals/${animal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !animal.published })
      });
      const data = await res.json();
      
      if (data.success) {
        fetchAnimals();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
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
        <div className="text-[#401E01]">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#401E01]">Animals for Adoption</h1>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#164020] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d2b16] transition-colors"
        >
          + Add New Animal
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
            {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Name</label>
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
                <label className="block text-sm font-medium text-[#401E01] mb-2">Type</label>
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
                <label className="block text-sm font-medium text-[#401E01] mb-2">Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2 years"
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                >
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#401E01] mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="/images/animal.jpg"
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#401E01] mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-[#401E01]">Vaccinated</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="neutered"
                    checked={formData.neutered}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-[#401E01]">Neutered</span>
                </label>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                className="bg-[#164020] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0d2b16] transition-colors"
              >
                {editingAnimal ? 'Update Animal' : 'Add Animal'}
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
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Image</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Name</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Type</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Breed</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Status</th>
              <th className="text-left px-6 py-4 text-[#401E01] font-semibold">Published</th>
              <th className="text-right px-6 py-4 text-[#401E01] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-[#401E01]/60">
                  No animals found. Add your first animal!
                </td>
              </tr>
            ) : (
              animals.map((animal) => (
                <tr key={animal._id} className="border-t border-[#401E01]/10">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-[#401E01]/10 rounded-lg overflow-hidden">
                      {animal.image && (
                        <img src={animal.image} alt={animal.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#401E01]">{animal.name}</td>
                  <td className="px-6 py-4 text-[#401E01]/70">{animal.type}</td>
                  <td className="px-6 py-4 text-[#401E01]/70">{animal.breed}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      animal.status === 'available' ? 'bg-green-100 text-green-800' :
                      animal.status === 'adopted' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {animal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(animal)}
                      className={`p-2 rounded-lg ${animal.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {animal.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editAnimal(animal)}
                        className="p-2 bg-[#164020]/10 text-[#164020] rounded-lg hover:bg-[#164020]/20"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(animal._id)}
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
