import mongoose from 'mongoose';

const ResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  token: { type: String, required: true, unique: true, index: true },
  otpHash: { type: String, select: false },
  otpVerified: { type: Boolean, default: false },
  otpAttempts: { type: Number, default: 0 },
  purpose: { type: String, enum: ['invite', 'password_reset'], default: 'password_reset' },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
});

export default mongoose.models.ResetToken || mongoose.model('ResetToken', ResetTokenSchema);
