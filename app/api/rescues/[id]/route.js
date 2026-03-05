import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rescue from '@/models/Rescue';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const rescue = await Rescue.findById(id);
    if (!rescue) {
      return NextResponse.json({ success: false, error: 'Rescue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rescue });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    body.updatedAt = new Date();
    const rescue = await Rescue.findByIdAndUpdate(id, body, { returnDocument: 'after' });
    if (!rescue) {
      return NextResponse.json({ success: false, error: 'Rescue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rescue });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const rescue = await Rescue.findByIdAndDelete(id);
    if (!rescue) {
      return NextResponse.json({ success: false, error: 'Rescue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
