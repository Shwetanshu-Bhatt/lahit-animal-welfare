import mongoose from 'mongoose';

export const ADOPTION_INQUIRY_TRANSITIONS = {
  new: ['contacted', 'rejected'],
  contacted: ['screening', 'rejected'],
  screening: ['approved', 'rejected'],
  approved: [],
  rejected: [],
};

const AdoptionInquirySchema = new mongoose.Schema({
  animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  animalName: { type: String, required: true, trim: true },
  applicantName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  homeType: { type: String, enum: ['Apartment', 'Independent house', 'Farm', 'Other'], required: true },
  experience: { type: String, default: '', trim: true },
  message: { type: String, default: '', trim: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'screening', 'approved', 'rejected'],
    default: 'new',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AdoptionInquirySchema.index({ email: 1, createdAt: -1 });
AdoptionInquirySchema.index({ animal: 1, status: 1 });

export default mongoose.models.AdoptionInquiry || mongoose.model('AdoptionInquiry', AdoptionInquirySchema);
