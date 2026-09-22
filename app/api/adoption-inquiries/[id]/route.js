import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdoptionInquiry, { ADOPTION_INQUIRY_TRANSITIONS } from '@/models/AdoptionInquiry';
import Animal from '@/models/Animal';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

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

    const allowedTransitions = ADOPTION_INQUIRY_TRANSITIONS[currentInquiry.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json({
        success: false,
        error: `A ${currentInquiry.status} application can only move to: ${allowedTransitions.join(', ') || 'a terminal state'}.`,
      }, { status: 409 });
    }

    const animal = await Animal.findById(currentInquiry.animal);
    if (!animal) {
      return NextResponse.json({ success: false, error: 'The linked animal no longer exists.' }, { status: 409 });
    }
    if (status === 'approved' && animal.status === 'adopted') {
      return NextResponse.json({ success: false, error: 'This animal has already been adopted.' }, { status: 409 });
    }

    const inquiry = await AdoptionInquiry.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { returnDocument: 'after', runValidators: true }
    );

    if (inquiry?.animal && status === 'approved') {
      await Animal.findByIdAndUpdate(inquiry.animal, { status: 'adopted', published: false, updatedAt: new Date() }, { runValidators: true });
    } else if (inquiry?.animal && status === 'rejected') {
      const activeInquiry = await AdoptionInquiry.exists({
        animal: inquiry.animal,
        _id: { $ne: inquiry._id },
        status: { $in: ['new', 'contacted', 'screening'] },
      });
      if (!activeInquiry && animal.status !== 'adopted') {
        await Animal.findByIdAndUpdate(inquiry.animal, { status: 'available', updatedAt: new Date() }, { runValidators: true });
      }
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
