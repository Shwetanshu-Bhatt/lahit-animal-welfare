import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RescueReport, { RESCUE_STATUS_TRANSITIONS } from '@/models/RescueReport';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();
    const currentReport = await RescueReport.findById(id);
    if (!currentReport) return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });

    const allowedTransitions = RESCUE_STATUS_TRANSITIONS[currentReport.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json({
        success: false,
        error: `A ${currentReport.status} report can only move to: ${allowedTransitions.join(', ') || 'a terminal state'}.`,
      }, { status: 409 });
    }

    const report = await RescueReport.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { returnDocument: 'after', runValidators: true });
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    return apiErrorResponse(error);
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
    return apiErrorResponse(error);
  }
}
