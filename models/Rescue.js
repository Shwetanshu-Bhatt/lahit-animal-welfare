import mongoose from 'mongoose';

const RescueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  type: {
    type: String,
    required: [true, 'Please provide animal type'],
    enum: ['Dog', 'Cat', 'Cow', 'Bird', 'Other'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  beforeImage: {
    type: String,
    required: [true, 'Please provide a before image'],
  },
  afterImage: {
    type: String,
    required: [true, 'Please provide an after image'],
  },
  story: {
    type: String,
    required: [true, 'Please provide a story'],
  },
  date: {
    type: String,
    required: [true, 'Please provide a date'],
  },
  published: {
    type: Boolean,
    default: true,
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

export default mongoose.models.Rescue || mongoose.model('Rescue', RescueSchema);
