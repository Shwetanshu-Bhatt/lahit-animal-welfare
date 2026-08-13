import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'A password of at least 6 characters is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email }).select('+password');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ success: true, message: 'Password updated.' });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
