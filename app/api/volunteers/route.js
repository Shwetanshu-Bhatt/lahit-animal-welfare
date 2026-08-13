import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: volunteers });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const volunteer = await Volunteer.create({
      name: body.name,
      email: body.email?.trim().toLowerCase(),
      phone: body.phone,
      location: body.location,
      interest: body.interest,
      message: body.message || '',
    });
    return NextResponse.json({ success: true, data: volunteer }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
