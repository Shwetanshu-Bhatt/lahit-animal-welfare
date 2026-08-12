import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RescueReport from '@/models/RescueReport';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

function isValidReportImage(image) {
  return !image || (image.startsWith('data:image/') && image.length <= 2_000_000);
}

export async function GET() {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const reports = await RescueReport.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: reports }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!isValidReportImage(body.image)) {
      return NextResponse.json({ success: false, error: 'Please upload a valid rescue photo smaller than 2 MB.' }, { status: 400 });
    }
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
    return apiErrorResponse(error);
  }
}
