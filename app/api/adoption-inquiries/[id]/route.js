import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdoptionInquiry from '@/models/AdoptionInquiry';
import Animal from '@/models/Animal';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const inquiryStatusToAnimalStatus = {
  new: 'pending',
  contacted: 'pending',
  screening: 'pending',
  approved: 'adopted',
  rejected: 'available',
};

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    const currentInquiry = await AdoptionInquiry.findById(id);
    if (!currentInquiry) {
      return NextResponse.json({ success: false, error: 'Adoption inquiry not found' }, { status: 404 });
    }

    const inquiry = await AdoptionInquiry.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { returnDocument: 'after', runValidators: true }
    );

    const nextAnimalStatus = inquiryStatusToAnimalStatus[status] ?? 'available';

    if (inquiry?.animal) {
      const animalUpdate = { status: nextAnimalStatus, updatedAt: new Date() };
      if (nextAnimalStatus === 'adopted') animalUpdate.published = false;

      await Animal.findByIdAndUpdate(inquiry.animal, animalUpdate, { runValidators: true });
    }

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
