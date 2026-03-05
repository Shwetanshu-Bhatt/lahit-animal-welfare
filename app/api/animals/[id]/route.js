import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Animal from '@/models/Animal';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const animal = await Animal.findById(id);
    if (!animal) {
      return NextResponse.json({ success: false, error: 'Animal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: animal });
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
    const animal = await Animal.findByIdAndUpdate(id, body, { returnDocument: 'after' });
    if (!animal) {
      return NextResponse.json({ success: false, error: 'Animal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: animal });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const animal = await Animal.findByIdAndDelete(id);
    if (!animal) {
      return NextResponse.json({ success: false, error: 'Animal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
