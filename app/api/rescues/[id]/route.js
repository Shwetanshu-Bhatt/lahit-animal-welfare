import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rescue from '@/models/Rescue';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';
import { PUBLIC_CACHE_CONTROL, PRIVATE_CACHE_CONTROL } from '@/lib/cache-headers';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const rescue = await Rescue.findById(id).lean();
    if (!rescue) {
      return NextResponse.json({ success: false, error: 'Rescue not found' }, { status: 404 });
    }
    if (!rescue.published && !(await requireAdmin())) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: rescue }, {
      headers: { 'Cache-Control': rescue.published ? PUBLIC_CACHE_CONTROL : PRIVATE_CACHE_CONTROL },
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
    body.updatedAt = new Date();
    const rescue = await Rescue.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!rescue) {
      return NextResponse.json({ success: false, error: 'Rescue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rescue });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const rescue = await Rescue.findByIdAndDelete(id);
    if (!rescue) {
      return NextResponse.json({ success: false, error: 'Rescue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
