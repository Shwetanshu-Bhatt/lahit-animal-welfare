import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { apiErrorResponse } from '@/lib/api-error';
import { completePasswordReset } from '@/lib/password-reset';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { token, password } = await request.json();
    if (!token) {
      return NextResponse.json({ success: false, error: 'Reset token is required' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'A password of at least 6 characters is required' }, { status: 400 });
    }

    const result = await completePasswordReset({ token, password });
    if (!result.ok) return NextResponse.json({ success: false, error: result.error }, { status: result.status });

    return NextResponse.json({ success: true, message: 'Password set. You can now log in.' });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
