import mongoose from 'mongoose';

const RescueReportSchema = new mongoose.Schema({
  reporterName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  animalType: {
    type: String,
    enum: ['Dog', 'Cat', 'Cow', 'Bird', 'Other'],
    default: 'Other',
  },
  location: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'dispatched', 'resolved', 'dismissed'],
    default: 'new',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.RescueReport || mongoose.model('RescueReport', RescueReportSchema);
