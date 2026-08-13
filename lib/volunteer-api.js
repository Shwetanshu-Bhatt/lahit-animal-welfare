import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getVolunteerSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'volunteer' ? session : null;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: 'Authentication required' },
    { status: 401 }
  );
}
