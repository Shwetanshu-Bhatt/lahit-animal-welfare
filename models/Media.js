import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Please provide a filename'],
  },
  url: {
    type: String,
    required: [true, 'Please provide a URL'],
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    default: 'image',
  },
  category: {
    type: String,
    enum: ['rescue', 'animal', 'event', 'general', 'blog'],
    default: 'general',
  },
  size: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: String,
    default: 'Admin',
  },
  alt: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
