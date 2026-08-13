import { randomBytes, randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import ResetToken from '@/models/ResetToken';
import User from '@/models/User';
import { sendMail } from '@/lib/mailer';

const PASSWORD_RESET_TTL = 15 * 60 * 1000;
const INVITE_TTL = 48 * 60 * 60 * 1000;

export function getAppUrl(request) {
  return (process.env.NEXTAUTH_URL || new URL(request.url).origin).replace(/\/$/, '');
}

export async function createResetToken({ email, purpose = 'password_reset' }) {
  const isPasswordReset = purpose === 'password_reset';
  const token = randomBytes(32).toString('hex');
  const otp = isPasswordReset ? String(randomInt(100000, 1000000)) : null;
  const expiresAt = new Date(Date.now() + (isPasswordReset ? PASSWORD_RESET_TTL : INVITE_TTL));

  await ResetToken.create({
    email: email.toLowerCase().trim(),
    token,
    ...(otp ? { otpHash: await bcrypt.hash(otp, 10) } : {}),
    purpose,
    expiresAt,
  });

  return { token, otp, expiresAt };
}

export async function sendPasswordResetEmail({ user, link, otp }) {
  return sendMail({
    to: user.email,
    subject: 'LAHIT password reset code',
    text: `Hello ${user.name},\n\nYour LAHIT password reset code is ${otp}. It expires in 15 minutes.\n\nYou can also open this link: ${link}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `<p>Hello ${user.name},</p><p>Your LAHIT password reset code is <strong>${otp}</strong>. It expires in 15 minutes.</p><p><a href="${link}">Open the password reset page</a></p><p>If you did not request this, you can safely ignore this email.</p>`,
  });
}

export async function findValidResetToken(token) {
  if (!token) return null;
  return ResetToken.findOne({ token, used: false, expiresAt: { $gt: new Date() } }).select('+otpHash');
}

export async function verifyResetOtp(token, otp) {
  const resetToken = await findValidResetToken(token);
  if (!resetToken) return { ok: false, status: 400, error: 'This reset code is invalid or has expired.' };
  if (!resetToken.otpHash) return { ok: true, alreadyVerified: true };
  if (resetToken.otpVerified) return { ok: true, alreadyVerified: true };
  if (resetToken.otpAttempts >= 5) {
    return { ok: false, status: 429, error: 'Too many incorrect codes. Please request a new one.' };
  }

  const matches = await bcrypt.compare(String(otp || ''), resetToken.otpHash);
  if (!matches) {
    resetToken.otpAttempts += 1;
    await resetToken.save();
    return { ok: false, status: 400, error: 'The verification code is incorrect.' };
  }

  resetToken.otpVerified = true;
  await resetToken.save();
  return { ok: true };
}

export async function completePasswordReset({ token, password }) {
  const resetToken = await findValidResetToken(token);
  if (!resetToken) return { ok: false, status: 400, error: 'This reset link is invalid or has expired.' };
  if (resetToken.otpHash && !resetToken.otpVerified) {
    return { ok: false, status: 400, error: 'Verify the code sent to your email first.' };
  }

  const user = await User.findOne({ email: resetToken.email }).select('+password');
  if (!user) return { ok: false, status: 400, error: 'No account exists for this link.' };

  user.password = await bcrypt.hash(password, 12);
  await user.save();
  resetToken.used = true;
  await resetToken.save();
  return { ok: true };
}
