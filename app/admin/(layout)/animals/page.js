'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { uploadImage } from '@/lib/upload-image';

const animalStatusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'adopted', label: 'Adopted' },
];

export default function AdminAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    fetchAnimals();
    const handleAnimalsRefresh = () => fetchAnimals();
    window.addEventListener('adoption-inquiries-changed', handleAnimalsRefresh);

    return () => {
      window.removeEventListener('adoption-inquiries-changed', handleAnimalsRefresh);
    };
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
      const sanitizedFormData = {
        ...formData,
        published: formData.status === 'adopted' ? false : formData.published
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedFormData)
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

  function openConfirmDialog({ title, message, confirmLabel = 'OK', confirmButtonClass = 'btn-primary', onConfirm }) {
    setConfirmDialog({
      title,
      message,
      confirmLabel,
      confirmButtonClass,
      onConfirm,
    });
  }

  function closeConfirmDialog() {
    setConfirmDialog(null);
  }

  async function handleDelete(id) {
    openConfirmDialog({
      title: 'Delete animal',
      message: 'Are you sure you want to delete this animal? This action cannot be undone.',
      confirmLabel: 'Delete',
      confirmButtonClass: 'btn-error',
      onConfirm: async () => {
        closeConfirmDialog();
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
    });
  }

  async function togglePublish(animal) {
    const isPublishing = !animal.published;
    const warningMessage = animal.status === 'adopted'
      ? 'This animal is already marked as adopted and will be hidden from the public adoption list. Unpublish it now?'
      : isPublishing
        ? 'Publish this animal to the public adoption listing?'
        : 'Unpublish this animal from the public adoption listing?';

    openConfirmDialog({
      title: isPublishing ? 'Publish animal' : 'Unpublish animal',
      message: warningMessage,
      confirmLabel: isPublishing ? 'Publish' : 'Unpublish',
      confirmButtonClass: isPublishing ? 'btn-primary' : 'btn-warning',
      onConfirm: async () => {
        closeConfirmDialog();
        setTogglingId(animal._id);
        const previousPublished = animal.published;
        setAnimals(prev => prev.map(a => 
          a._id === animal._id ? { ...a, published: isPublishing } : a
        ));

        try {
          const res = await fetch(`/api/animals/${animal._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: isPublishing })
          });
          const data = await res.json();
          
          if (!data.success) {
            setAnimals(prev => prev.map(a => 
              a._id === animal._id ? { ...a, published: previousPublished } : a
            ));
          } else {
            setMessage({ type: 'success', text: isPublishing ? 'Animal published successfully.' : 'Animal unpublished successfully.' });
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
    });
  }

  async function updateAnimalStatus(animal, nextStatus) {
    const previousStatus = animal.status;
    const willBeAdopted = nextStatus === 'adopted';

    if (willBeAdopted) {
      openConfirmDialog({
        title: 'Mark as adopted',
        message: 'Changing this animal to adopted will automatically unpublish it from the public adoption list. Continue?',
        confirmLabel: 'OK',
        confirmButtonClass: 'btn-primary',
        onConfirm: async () => {
          closeConfirmDialog();
          setStatusUpdatingId(animal._id);
          const nextPublished = false;
          setAnimals(prev => prev.map((item) => item._id === animal._id ? { ...item, status: nextStatus, published: nextPublished } : item));

          try {
            const res = await fetch(`/api/animals/${animal._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: nextStatus, published: nextPublished })
            });
            const data = await res.json();

            if (!data.success) {
              setAnimals(prev => prev.map((item) => item._id === animal._id ? { ...item, status: previousStatus, published: animal.published } : item));
              setMessage({ type: 'error', text: data.error || 'Failed to update animal status.' });
            } else {
              setMessage({ type: 'success', text: 'Animal marked as adopted and automatically unpublished.' });
            }
          } catch (error) {
            console.error('Error updating animal status:', error);
            setAnimals(prev => prev.map((item) => item._id === animal._id ? { ...item, status: previousStatus, published: animal.published } : item));
            setMessage({ type: 'error', text: 'Error updating animal status.' });
          } finally {
            setStatusUpdatingId(null);
          }
        }
      });
      return;
    }

    setStatusUpdatingId(animal._id);
    const nextPublished = animal.published;
    setAnimals(prev => prev.map((item) => item._id === animal._id ? { ...item, status: nextStatus, published: nextPublished } : item));

    try {
      const res = await fetch(`/api/animals/${animal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, published: nextPublished })
      });
      const data = await res.json();

      if (!data.success) {
        setAnimals(prev => prev.map((item) => item._id === animal._id ? { ...item, status: previousStatus, published: animal.published } : item));
        setMessage({ type: 'error', text: data.error || 'Failed to update animal status.' });
      } else {
        setMessage({ type: 'success', text: 'Animal status updated successfully.' });
      }
    } catch (error) {
      console.error('Error updating animal status:', error);
      setAnimals(prev => prev.map((item) => item._id === animal._id ? { ...item, status: previousStatus, published: animal.published } : item));
      setMessage({ type: 'error', text: 'Error updating animal status.' });
    } finally {
      setStatusUpdatingId(null);
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
      published: animal.status === 'adopted' ? false : animal.published
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
    setUploadingImage(false);
  }

  async function handleImageUpload(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please choose an image file.' });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image files must be smaller than 8 MB.' });
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: result.url }));
      setMessage({ type: 'success', text: 'Image uploaded successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Image upload failed.' });
    } finally {
      setUploadingImage(false);
    }
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
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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

      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 shadow-2xl">
            <div className="px-6 pb-4 pt-5">
              <h3 className="text-xl font-semibold text-primary">{confirmDialog.title}</h3>
              <p className="mt-3 text-sm text-base-content/70">{confirmDialog.message}</p>
            </div>
            <div className="flex justify-end gap-3 border-t border-base-200 bg-base-200/40 px-6 py-4">
              <button type="button" className="btn btn-ghost" onClick={closeConfirmDialog}>
                Cancel
              </button>
              <button
                type="button"
                className={`btn ${confirmDialog.confirmButtonClass || 'btn-primary'}`}
                onClick={() => {
                  if (confirmDialog.onConfirm) {
                    confirmDialog.onConfirm();
                  } else {
                    closeConfirmDialog();
                  }
                }}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
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
                  <label className="block text-sm font-medium text-primary mb-2">Image</label>
                  <div className="rounded-xl border border-base-300 bg-base-200/40 p-3">
                    {formData.image ? (
                      <div className="relative h-48 w-full overflow-hidden rounded-lg mb-3">
                        <Image src={formData.image} alt="Animal preview" fill unoptimized className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-base-300 text-sm text-primary/60 mb-3">
                        No image selected
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <label className="btn btn-sm btn-primary cursor-pointer">
                        {uploadingImage ? 'Uploading...' : 'Upload image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleImageUpload(event.target.files?.[0])}
                        />
                      </label>

                      {formData.image && (
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost text-error"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
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
                animals.map((animal) => {
                  const isAutoUnpublished = animal.status === 'adopted';
                  const isPublished = !isAutoUnpublished && Boolean(animal.published);

                  return (
                    <tr key={animal._id} className="hover:bg-base-200/50">
                      <td>
                        <div className="relative w-12 h-12 bg-base-300 rounded-lg overflow-hidden">
                          {animal.image && (
                            <Image src={animal.image} alt={animal.name} fill unoptimized className="object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="font-medium text-primary">{animal.name}</td>
                      <td className="text-primary/70">{animal.type}</td>
                      <td className="text-primary/70">{animal.breed}</td>
                      <td>
                        <select
                          value={animal.status}
                          disabled={statusUpdatingId === animal._id}
                          onChange={(event) => updateAnimalStatus(animal, event.target.value)}
                          className={`select select-bordered select-xs min-w-[120px] ${
                            animal.status === 'available' ? 'text-success' :
                            animal.status === 'adopted' ? 'text-primary' :
                            'text-warning'
                          }`}
                        >
                          {animalStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="flex flex-col items-start gap-1">
                          <button
                            onClick={() => togglePublish(animal)}
                            disabled={togglingId === animal._id}
                            className={`btn btn-sm ${isPublished ? 'btn-success' : 'btn-error'}`}
                          >
                            {togglingId === animal._id ? '...' : isPublished ? 'Yes' : 'No'}
                          </button>
                          {isAutoUnpublished && (
                            <span className="text-[10px] font-medium uppercase tracking-wide text-warning">
                              Auto-unpublished
                            </span>
                          )}
                        </div>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
