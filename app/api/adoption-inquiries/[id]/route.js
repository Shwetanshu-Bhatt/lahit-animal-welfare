import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdoptionInquiry from '@/models/AdoptionInquiry';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();
    const inquiry = await AdoptionInquiry.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { returnDocument: 'after', runValidators: true });
    if (!inquiry) return NextResponse.json({ success: false, error: 'Adoption inquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const inquiry = await AdoptionInquiry.findByIdAndDelete(id);
    if (!inquiry) return NextResponse.json({ success: false, error: 'Adoption inquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
