import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  coverImage: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Admin',
  },
  category: {
    type: String,
    enum: ['Rescue Stories', 'Medical Updates', 'Feeding Drives', 'Adoption', 'Volunteer Events', 'General'],
    default: 'General',
  },
  tags: [{
    type: String,
  }],
  published: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BlogSchema.pre('save', function() {
  if (this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  this.updatedAt = new Date();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
