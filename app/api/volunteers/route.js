import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: volunteers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const volunteer = await Volunteer.create(body);
    return NextResponse.json({ success: true, data: volunteer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
