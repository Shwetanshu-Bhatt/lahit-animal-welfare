import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { apiErrorResponse } from '@/lib/api-error';
import { verifyResetOtp } from '@/lib/password-reset';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { token, otp } = await request.json();
    if (!token || !/^\d{6}$/.test(String(otp || ''))) {
      return NextResponse.json({ success: false, error: 'A valid six-digit code is required.' }, { status: 400 });
    }

    const result = await verifyResetOtp(token, otp);
    if (!result.ok) return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    return NextResponse.json({ success: true, message: 'Code verified.' });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
