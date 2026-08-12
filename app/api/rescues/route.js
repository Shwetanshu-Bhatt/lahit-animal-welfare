import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rescue from '@/models/Rescue';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    if (includeAll && !(await requireAdmin())) return unauthorizedResponse();
    
    const query = includeAll ? {} : { published: true };
    const rescues = await Rescue.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: rescues }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const body = await request.json();
    const rescue = await Rescue.create(body);
    return NextResponse.json({ success: true, data: rescue }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
