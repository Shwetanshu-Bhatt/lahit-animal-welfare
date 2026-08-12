import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RescueReport from '@/models/RescueReport';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const reports = await RescueReport.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: reports }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const report = await RescueReport.create({
      reporterName: body.reporterName,
      phone: body.phone,
      animalType: body.animalType || 'Other',
      location: body.location,
      description: body.description,
      image: body.image || '',
    });
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    const status = error.name === 'ValidationError' ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
