'use client';

import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    facebook: '',
    instagram: '',
    youtube: '',
    maintenanceMode: false,
    upiId: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    bankBranch: '',
    donationTiers: [],
    instagramPosts: [],
    rescueLocations: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings.' });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleDonationTierChange(index, field, value) {
    const newTiers = [...settings.donationTiers];
    newTiers[index] = { ...newTiers[index], [field]: field === 'amount' ? parseInt(value) : value };
    setSettings(prev => ({ ...prev, donationTiers: newTiers }));
  }

  function handleInstagramPostChange(index, field, value) {
    const newPosts = [...settings.instagramPosts];
    newPosts[index] = { ...newPosts[index], [field]: value };
    setSettings(prev => ({ ...prev, instagramPosts: newPosts }));
  }

  function addDonationTier() {
    const newTier = {
      id: Date.now(),
      amount: 1000,
      title: 'New Tier',
      description: 'Description',
      icon: 'Heart',
      impact: 'Impact description'
    };
    setSettings(prev => ({ ...prev, donationTiers: [...prev.donationTiers, newTier] }));
  }

  function removeDonationTier(index) {
    const newTiers = settings.donationTiers.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, donationTiers: newTiers }));
  }

  function addInstagramPost() {
    const newPost = {
      id: Date.now(),
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
      caption: 'New post caption',
      likes: 0,
      comments: 0
    };
    setSettings(prev => ({ ...prev, instagramPosts: [...prev.instagramPosts, newPost] }));
  }

  function removeInstagramPost(index) {
    const newPosts = settings.instagramPosts.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, instagramPosts: newPosts }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#401E01]">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'donation', label: 'Donation Settings' },
    { id: 'social', label: 'Social Media' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#401E01] mb-8">Settings</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#401E01]/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[#164020] border-b-2 border-[#164020]'
                : 'text-[#401E01]/60 hover:text-[#401E01]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div>
            <h2 className="text-xl font-bold text-[#401E01] mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Contact Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#401E01] mb-2">Site Description</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode || false}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-[#401E01]">Enable Maintenance Mode</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Donation Settings */}
        {activeTab === 'donation' && (
          <div>
            <h2 className="text-xl font-bold text-[#401E01] mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={settings.upiId || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Bank Account Name</label>
                <input
                  type="text"
                  name="bankAccountName"
                  value={settings.bankAccountName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={settings.bankAccountNumber || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">IFSC Code</label>
                <input
                  type="text"
                  name="bankIfscCode"
                  value={settings.bankIfscCode || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={settings.bankName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Branch</label>
                <input
                  type="text"
                  name="bankBranch"
                  value={settings.bankBranch || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#401E01] mb-4">Donation Tiers</h2>
            <div className="space-y-4 mb-4">
              {(settings.donationTiers || []).map((tier, index) => (
                <div key={tier.id || index} className="flex gap-4 items-start p-4 bg-[#F2CDAC] rounded-xl">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={tier.amount}
                      onChange={(e) => handleDonationTierChange(index, 'amount', e.target.value)}
                      placeholder="Amount"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                    <input
                      type="text"
                      value={tier.title}
                      onChange={(e) => handleDonationTierChange(index, 'title', e.target.value)}
                      placeholder="Title"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) => handleDonationTierChange(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                    <input
                      type="text"
                      value={tier.impact}
                      onChange={(e) => handleDonationTierChange(index, 'impact', e.target.value)}
                      placeholder="Impact"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDonationTier(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDonationTier}
              className="px-4 py-2 bg-[#164020] text-white rounded-lg hover:bg-[#0d2b16]"
            >
              + Add Tier
            </button>
          </div>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <div>
            <h2 className="text-xl font-bold text-[#401E01] mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={settings.facebook || ''}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={settings.instagram || ''}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#401E01] mb-2">YouTube</label>
                <input
                  type="text"
                  name="youtube"
                  value={settings.youtube || ''}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-3 border border-[#401E01]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164020]"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#401E01] mb-4">Instagram Posts (Homepage Feed)</h2>
            <div className="space-y-4 mb-4">
              {(settings.instagramPosts || []).map((post, index) => (
                <div key={post.id || index} className="flex gap-4 items-start p-4 bg-[#F2CDAC] rounded-xl">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={post.image}
                      onChange={(e) => handleInstagramPostChange(index, 'image', e.target.value)}
                      placeholder="Image URL"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                    <input
                      type="text"
                      value={post.caption}
                      onChange={(e) => handleInstagramPostChange(index, 'caption', e.target.value)}
                      placeholder="Caption"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                    <input
                      type="number"
                      value={post.likes}
                      onChange={(e) => handleInstagramPostChange(index, 'likes', e.target.value)}
                      placeholder="Likes"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                    <input
                      type="number"
                      value={post.comments}
                      onChange={(e) => handleInstagramPostChange(index, 'comments', e.target.value)}
                      placeholder="Comments"
                      className="px-3 py-2 border border-[#401E01]/20 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstagramPost(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addInstagramPost}
              className="px-4 py-2 bg-[#164020] text-white rounded-lg hover:bg-[#0d2b16]"
            >
              + Add Post
            </button>
          </div>
        )}
        
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
