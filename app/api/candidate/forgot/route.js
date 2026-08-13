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

    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'volunteer' });

    // Always return the same message to avoid disclosing whether the account exists.
    const response = { success: true, message: 'If an account exists for that email, a reset code has been sent.' };

    if (user) {
      const { token, otp } = await createResetToken({ email: user.email });
      const link = `${getAppUrl(request)}/candidate/reset?token=${token}`;

      try {
        await sendPasswordResetEmail({ user, link, otp });
      } catch (mailError) {
        console.error('Failed to send volunteer reset email:', mailError);
      }

      if (!isMailConfigured() && process.env.NODE_ENV !== 'production') {
        response.resetLink = `/candidate/reset?token=${token}`;
        response.resetOtp = otp;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
