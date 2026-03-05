'use client';

import { useState, useEffect } from 'react';
import { Check, X, Trash2, Mail, Phone, MapPin, Heart } from 'lucide-react';

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
    // Optimistic update
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
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

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
        <h1 className="text-3xl font-bold text-[#401E01]">Volunteer Applications</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-[#164020] text-white'
                  : 'bg-white text-[#401E01] hover:bg-[#164020]/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredVolunteers.length === 0 ? (
          <div className="p-8 text-center text-[#401E01]/60">
            No volunteer applications found.
          </div>
        ) : (
          <div className="divide-y divide-[#401E01]/10">
            {filteredVolunteers.map((volunteer) => (
              <div key={volunteer._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold text-[#401E01]">{volunteer.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[volunteer.status]}`}>
                        {volunteer.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-[#401E01]/70">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {volunteer.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {volunteer.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {volunteer.location}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#164020]" />
                      <span className="text-sm text-[#401E01]/70">{volunteer.interest}</span>
                    </div>

                    {volunteer.message && (
                      <p className="mt-2 text-sm text-[#401E01]/60 italic">
                        "{volunteer.message}"
                      </p>
                    )}

                    <p className="mt-2 text-xs text-[#401E01]/40">
                      Applied on: {new Date(volunteer.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {volunteer.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(volunteer._id, 'approved')}
                          disabled={processingId === volunteer._id}
                          className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50"
                          title="Approve"
                        >
                          {processingId === volunteer._id ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => updateStatus(volunteer._id, 'rejected')}
                          disabled={processingId === volunteer._id}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50"
                          title="Reject"
                        >
                          {processingId === volunteer._id ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                    {volunteer.status === 'rejected' && (
                      <button
                        onClick={() => deleteVolunteer(volunteer._id)}
                        disabled={deletingId === volunteer._id}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50"
                        title="Delete (Required to re-approve)"
                      >
                        {deletingId === volunteer._id ? (
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    {volunteer.status === 'approved' && (
                      <button
                        onClick={() => deleteVolunteer(volunteer._id)}
                        disabled={deletingId === volunteer._id}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50"
                        title="Remove Volunteer"
                      >
                        {deletingId === volunteer._id ? (
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
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
  );
}
