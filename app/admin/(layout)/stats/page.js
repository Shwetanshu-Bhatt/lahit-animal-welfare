'use client';

import { useState, useEffect } from 'react';

export default function AdminStats() {
  const [stats, setStats] = useState({
    animalsRescued: 0,
    mealsServed: 0,
    treatments: 0,
    adoptions: 0,
    volunteers: 0,
    citiesCovered: 0,
    partnerVets: 0,
    yearsActive: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Statistics updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update statistics.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating statistics.' });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
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
      <h1 className="text-3xl font-bold text-[#401E01] mb-8">Statistics</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Animals Rescued
            </label>
            <input
              type="number"
              name="animalsRescued"
              value={stats.animalsRescued}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Meals Served
            </label>
            <input
              type="number"
              name="mealsServed"
              value={stats.mealsServed}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Treatments
            </label>
            <input
              type="number"
              name="treatments"
              value={stats.treatments}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Adoptions
            </label>
            <input
              type="number"
              name="adoptions"
              value={stats.adoptions}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Volunteers
            </label>
            <input
              type="number"
              name="volunteers"
              value={stats.volunteers}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Cities Covered
            </label>
            <input
              type="number"
              name="citiesCovered"
              value={stats.citiesCovered}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Partner Vets
            </label>
            <input
              type="number"
              name="partnerVets"
              value={stats.partnerVets}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#401E01] mb-2">
              Years Active
            </label>
            <input
              type="number"
              name="yearsActive"
              value={stats.yearsActive}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#164020] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0d2b16] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
