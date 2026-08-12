import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Media from '@/models/Media';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const media = await Media.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!media) {
      return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const media = await Media.findByIdAndDelete(id);
    if (!media) {
      return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
