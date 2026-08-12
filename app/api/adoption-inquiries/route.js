import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Animal from '@/models/Animal';
import AdoptionInquiry from '@/models/AdoptionInquiry';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const inquiries = await AdoptionInquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: inquiries }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const animal = await Animal.findOne({ _id: body.animalId, published: true, status: 'available' });
    if (!animal) {
      return NextResponse.json({ success: false, error: 'This animal is no longer available for adoption.' }, { status: 404 });
    }

    const inquiry = await AdoptionInquiry.create({
      animal: animal._id,
      animalName: animal.name,
      applicantName: body.applicantName,
      email: body.email,
      phone: body.phone,
      location: body.location,
      homeType: body.homeType,
      experience: body.experience || '',
      message: body.message || '',
    });
    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
