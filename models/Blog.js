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
    default: 'General',
    trim: true,
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

BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ published: 1, category: 1, createdAt: -1 });
BlogSchema.index({ published: 1, featured: 1, createdAt: -1 });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
