import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  interest: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);
