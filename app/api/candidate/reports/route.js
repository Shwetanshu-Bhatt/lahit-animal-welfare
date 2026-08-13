import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RescueReport from '@/models/RescueReport';
import { requireCandidate, candidateUnauthorized } from '@/lib/candidate-api';

export const dynamic = 'force-dynamic';

function isValidReportImage(image) {
  return !image || (image.startsWith('data:image/') && image.length <= 2_000_000);
}

export async function GET() {
  const session = await requireCandidate();
  if (!session) return candidateUnauthorized();

  try {
    await connectDB();
    const reports = await RescueReport.find({ reporterEmail: session.user.email.toLowerCase() }).select('-image').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: reports }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load rescue reports' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await requireCandidate();
  if (!session) return candidateUnauthorized();

  try {
    const body = await request.json();
    if (!body.phone || !body.location || !body.description) {
      return NextResponse.json({ success: false, error: 'Phone, location, and description are required.' }, { status: 400 });
    }
    if (!isValidReportImage(body.image)) {
      return NextResponse.json({ success: false, error: 'Please upload a valid rescue photo smaller than 2 MB.' }, { status: 400 });
    }

    await connectDB();
    const report = await RescueReport.create({
      reporterName: session.user.name || 'LAHIT volunteer',
      reporterEmail: session.user.email.toLowerCase(),
      phone: body.phone.trim(),
      animalType: body.animalType || 'Other',
      location: body.location.trim(),
      description: body.description.trim(),
      image: body.image || '',
    });
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not submit rescue report' }, { status: 500 });
  }
}
