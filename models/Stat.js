import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  animalsRescued: { type: Number, default: 0 },
  mealsServed: { type: Number, default: 0 },
  treatments: { type: Number, default: 0 },
  adoptions: { type: Number, default: 0 },
  volunteers: { type: Number, default: 0 },
  citiesCovered: { type: Number, default: 0 },
  partnerVets: { type: Number, default: 0 },
  yearsActive: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Stat || mongoose.model('Stat', StatSchema);
