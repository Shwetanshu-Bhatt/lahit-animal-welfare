import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RescueReport from '@/models/RescueReport';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();
    const report = await RescueReport.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true, runValidators: true });
    if (!report) return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    const status = error.name === 'ValidationError' ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const report = await RescueReport.findByIdAndDelete(id);
    if (!report) return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
