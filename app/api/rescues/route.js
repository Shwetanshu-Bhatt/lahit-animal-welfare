import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rescue from '@/models/Rescue';

export async function GET() {
  try {
    await connectDB();
    const rescues = await Rescue.find({ published: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: rescues });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const rescue = await Rescue.create(body);
    return NextResponse.json({ success: true, data: rescue }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
