import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rescue from '@/models/Rescue';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';
import { PUBLIC_CACHE_CONTROL, PRIVATE_CACHE_CONTROL } from '@/lib/cache-headers';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    if (includeAll && !(await requireAdmin())) return unauthorizedResponse();
    
    const query = includeAll ? {} : { published: true };
    const rescues = await Rescue.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ success: true, data: rescues }, {
      headers: { 'Cache-Control': includeAll ? PRIVATE_CACHE_CONTROL : PUBLIC_CACHE_CONTROL }
    });
  } catch (error) {
    return apiErrorResponse(error);
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
    return apiErrorResponse(error);
  }
}
