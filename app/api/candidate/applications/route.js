import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdoptionInquiry from '@/models/AdoptionInquiry';
import { requireCandidate, candidateUnauthorized } from '@/lib/candidate-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireCandidate();
  if (!session) return candidateUnauthorized();

  try {
    await connectDB();
    const applications = await AdoptionInquiry.find({ email: session.user.email.toLowerCase() }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: applications }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load applications' }, { status: 500 });
  }
}
