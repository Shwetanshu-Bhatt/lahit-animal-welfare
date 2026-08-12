'use client';

import { useState, useEffect } from 'react';
import { Check, X, Trash2, Mail, Phone, MapPin, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    try {
      const res = await fetch('/api/volunteers');
      const data = await res.json();
      if (data.success) {
        setVolunteers(data.data);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    setProcessingId(id);
    const previousStatus = volunteers.find(v => v._id === id)?.status;
    setVolunteers(prev => prev.map(v => 
      v._id === id ? { ...v, status } : v
    ));

    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!data.success) {
        setVolunteers(prev => prev.map(v => 
          v._id === id ? { ...v, status: previousStatus } : v
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setVolunteers(prev => prev.map(v => 
        v._id === id ? { ...v, status: previousStatus } : v
      ));
    } finally {
      setProcessingId(null);
    }
  }

  async function deleteVolunteer(id) {
    if (!confirm('Are you sure you want to delete this volunteer?')) return;
    setDeletingId(id);
    
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setVolunteers(prev => prev.filter(v => v._id !== id));
      }
    } catch (error) {
      console.error('Error deleting volunteer:', error);
    } finally {
      setDeletingId(null);
    }
  }

  const filteredVolunteers = filter === 'all' 
    ? volunteers 
    : volunteers.filter(v => v.status === filter);

  const statusColors = {
    pending: 'badge-warning',
    contacted: 'badge-info',
    approved: 'badge-success',
    rejected: 'badge-error'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary">Volunteer Applications</h1>
        <div className="join">
          {['all', 'pending', 'contacted', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`join-item btn btn-sm ${filter === status ? 'btn-primary' : 'btn-ghost'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {filteredVolunteers.length === 0 ? (
            <div className="text-center text-primary/60 py-8">
              No volunteer applications found.
            </div>
          ) : (
            <div className="divide-y divide-base-300">
              {filteredVolunteers.map((volunteer) => (
                <div key={volunteer._id} className="py-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-primary">{volunteer.name}</h3>
                        <span className={`badge ${statusColors[volunteer.status] || 'badge-neutral'} badge-sm`}>
                          {volunteer.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-primary/70">
                        <a href={`mailto:${volunteer.email}`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="w-4 h-4" />
                          {volunteer.email}
                        </a>
                        <a href={`tel:${volunteer.phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone className="w-4 h-4" />
                          {volunteer.phone}
                        </a>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {volunteer.location}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary/70">{volunteer.interest}</span>
                      </div>

                      {volunteer.message && (
                        <p className="mt-2 text-sm text-primary/60 italic">
                          &quot;{volunteer.message}&quot;
                        </p>
                      )}

                      <p className="mt-2 text-xs text-primary/40">
                        Applied on: {new Date(volunteer.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {volunteer.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(volunteer._id, 'contacted')}
                          disabled={processingId === volunteer._id}
                          className="btn btn-sm btn-info"
                          title="Mark contacted"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      )}
                      {(volunteer.status === 'pending' || volunteer.status === 'contacted') && (
                        <>
                          <button
                            onClick={() => updateStatus(volunteer._id, 'approved')}
                            disabled={processingId === volunteer._id}
                            className="btn btn-sm btn-success"
                            title="Approve"
                          >
                            {processingId === volunteer._id ? (
                              <span className="loading loading-spinner loading-sm" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => updateStatus(volunteer._id, 'rejected')}
                            disabled={processingId === volunteer._id}
                            className="btn btn-sm btn-error"
                            title="Reject"
                          >
                            {processingId === volunteer._id ? (
                              <span className="loading loading-spinner loading-sm" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      )}
                      {(volunteer.status === 'contacted' || volunteer.status === 'rejected' || volunteer.status === 'approved') && (
                        <button
                          onClick={() => deleteVolunteer(volunteer._id)}
                          disabled={deletingId === volunteer._id}
                          className="btn btn-sm btn-error"
                          title="Remove"
                        >
                          {deletingId === volunteer._id ? (
                            <span className="loading loading-spinner loading-sm" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
