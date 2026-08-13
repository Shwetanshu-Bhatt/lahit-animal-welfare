import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { apiErrorResponse } from '@/lib/api-error';
import { findValidResetToken } from '@/lib/password-reset';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) {
      return NextResponse.json({ success: false, valid: false, error: 'Missing token' }, { status: 400 });
    }
    const doc = await findValidResetToken(token);
    if (!doc) {
      return NextResponse.json({ success: true, valid: false });
    }
    return NextResponse.json({
      success: true,
      valid: true,
      email: doc.email,
      requiresOtp: Boolean(doc.otpHash),
      otpVerified: Boolean(doc.otpVerified),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request) {
  return GET(request);
}
