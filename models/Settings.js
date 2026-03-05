import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'LAHIT - Animal Welfare' },
  siteDescription: { type: String, default: 'Helping animals in Uttarakhand' },
  contactEmail: { type: String, default: 'contact@lahit.org' },
  contactPhone: { type: String, default: '' },
  address: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  maintenanceMode: { type: Boolean, default: false },
  
  // Donation settings
  upiId: { type: String, default: 'lahit@upi' },
  bankAccountName: { type: String, default: 'LAHIT Animal Welfare' },
  bankAccountNumber: { type: String, default: '1234567890' },
  bankIfscCode: { type: String, default: 'HDFC0001234' },
  bankName: { type: String, default: 'HDFC Bank' },
  bankBranch: { type: String, default: 'Dehradun Main Branch' },
  
  // Donation tiers
  donationTiers: { type: Array, default: [
    { id: 1, amount: 500, title: 'Daily Meals', description: 'Feed stray dogs for a day', icon: 'Utensils', impact: 'Provides nutritious meals for 10 street dogs' },
    { id: 2, amount: 1500, title: 'Vaccination', description: 'Vaccination for one animal', icon: 'Syringe', impact: 'Complete vaccination course for a rescued animal' },
    { id: 3, amount: 3000, title: 'Emergency Treatment', description: 'Emergency treatment support', icon: 'HeartPulse', impact: 'Covers emergency medical treatment and medicines' },
    { id: 4, amount: 5000, title: 'Rescue Mission', description: 'Fund a complete rescue', icon: 'Ambulance', impact: 'Covers rescue, treatment, and rehabilitation' }
  ]},
  
  // Instagram posts
  instagramPosts: { type: Array, default: []},
  
  // Rescue locations
  rescueLocations: { type: Array, default: [
    { id: 1, name: 'Dehradun Rescue Center', coordinates: [30.3165, 78.0322], address: 'Rajpur Road, Dehradun', animalsHelped: 450 },
    { id: 2, name: 'Mussoorie Feeding Point', coordinates: [30.4598, 78.0644], address: 'Mall Road, Mussoorie', animalsHelped: 180 },
    { id: 3, name: 'Uttarkashi Shelter', coordinates: [30.7268, 78.4354], address: 'Main Market, Uttarkashi', animalsHelped: 95 },
    { id: 4, name: 'Rishikesh Care Unit', coordinates: [30.0869, 78.2676], address: 'Laxman Jhula Road, Rishikesh', animalsHelped: 220 },
    { id: 5, name: 'Haridwar Help Center', coordinates: [29.9457, 78.1642], address: 'Near Har Ki Pauri, Haridwar', animalsHelped: 165 }
  ]},
  
  // Volunteer activities
  volunteerActivities: { type: Array, default: [
    'Animal Rescue Operations',
    'Daily Feeding Drives',
    'Medical Assistance',
    'Adoption Events',
    'Community Awareness',
    'Foster Care'
  ]},
  
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
