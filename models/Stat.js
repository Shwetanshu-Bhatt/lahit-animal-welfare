import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  animalsRescued: { type: Number, default: 1200 },
  mealsServed: { type: Number, default: 30000 },
  treatments: { type: Number, default: 500 },
  adoptions: { type: Number, default: 200 },
  volunteers: { type: Number, default: 50 },
  citiesCovered: { type: Number, default: 15 },
  partnerVets: { type: Number, default: 10 },
  yearsActive: { type: Number, default: 4 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Stat || mongoose.model('Stat', StatSchema);
