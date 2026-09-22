import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Animal from '@/models/Animal';
import AdoptionInquiry from '@/models/AdoptionInquiry';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';
import { PUBLIC_CACHE_CONTROL, PRIVATE_CACHE_CONTROL } from '@/lib/cache-headers';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const animal = await Animal.findById(id).lean();
    if (!animal) {
      return NextResponse.json({ success: false, error: 'Animal not found' }, { status: 404 });
    }
    const normalizedAnimal = {
      ...animal,
      published: animal.status === 'adopted' ? false : animal.published
    };
    return NextResponse.json({ success: true, data: normalizedAnimal }, {
      headers: { 'Cache-Control': animal.published ? PUBLIC_CACHE_CONTROL : PRIVATE_CACHE_CONTROL },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const currentAnimal = await Animal.findById(id);
    if (!currentAnimal) {
      return NextResponse.json({ success: false, error: 'Animal not found' }, { status: 404 });
    }

    const safeBody = { updatedAt: new Date() };
    ['name', 'type', 'breed', 'age', 'gender', 'description', 'image', 'vaccinated', 'neutered', 'status', 'published']
      .forEach((field) => {
        if (body[field] !== undefined) safeBody[field] = body[field];
      });

    const nextStatus = safeBody.status || currentAnimal.status;
    if (currentAnimal.status === 'adopted' && nextStatus !== 'adopted') {
      return NextResponse.json({ success: false, error: 'Adopted animals are terminal records. Update the linked adoption application instead.' }, { status: 409 });
    }
    if (nextStatus === 'available' && currentAnimal.status === 'pending' && await AdoptionInquiry.exists({
      animal: id,
      status: { $in: ['new', 'contacted', 'screening'] },
    })) {
      return NextResponse.json({ success: false, error: 'This animal has an active adoption application. Resolve it from the Adoption inbox first.' }, { status: 409 });
    }
    if (nextStatus === 'adopted') {
      safeBody.published = false;
    }

    const animal = await Animal.findByIdAndUpdate(id, safeBody, { returnDocument: 'after', runValidators: true });
    return NextResponse.json({ success: true, data: animal });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const existingAnimal = await Animal.findById(id);
    if (!existingAnimal) return NextResponse.json({ success: false, error: 'Animal not found' }, { status: 404 });
    if (existingAnimal.status === 'adopted') {
      return NextResponse.json({ success: false, error: 'Adopted animals are kept for adoption history. Unpublish them instead.' }, { status: 409 });
    }
    if (await AdoptionInquiry.exists({ animal: id })) {
      return NextResponse.json({ success: false, error: 'This animal has adoption history. Keep the record and unpublish it instead.' }, { status: 409 });
    }
    const animal = await Animal.findByIdAndDelete(id);
    if (!animal) {
      return NextResponse.json({ success: false, error: 'Animal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
