import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function requireCandidate() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== 'volunteer') return null;
  return session;
}

export function candidateUnauthorized() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
