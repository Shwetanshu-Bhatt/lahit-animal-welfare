import mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Dog', 'Cat', 'Cow', 'Bird', 'Other'] },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female'] },
  description: { type: String, required: true },
  image: { type: String, required: true },
  vaccinated: { type: Boolean, default: false },
  neutered: { type: Boolean, default: false },
  status: { type: String, enum: ['available', 'adopted', 'pending'], default: 'available' },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Animal || mongoose.model('Animal', AnimalSchema);
