import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const volunteer = await Volunteer.findByIdAndUpdate(id, body, { returnDocument: 'after' });
    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
