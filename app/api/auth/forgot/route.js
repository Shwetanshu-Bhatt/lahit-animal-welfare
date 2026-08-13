import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { apiErrorResponse } from '@/lib/api-error';
import { isMailConfigured } from '@/lib/mailer';
import { createResetToken, getAppUrl, sendPasswordResetEmail } from '@/lib/password-reset';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'A valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    const response = { success: true, message: 'If an account exists for that email, a reset code has been sent.' };

    if (user) {
      const { token, otp } = await createResetToken({ email: user.email });
      const resetPath = user.role === 'volunteer' ? '/candidate/reset' : '/admin/reset';
      const link = `${getAppUrl(request)}${resetPath}?token=${token}`;
      try {
        await sendPasswordResetEmail({ user, link, otp });
      } catch (mailError) {
        console.error('Failed to send admin reset email:', mailError);
      }

      if (!isMailConfigured() && process.env.NODE_ENV !== 'production') {
        response.resetLink = `${resetPath}?token=${token}`;
        response.resetOtp = otp;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
