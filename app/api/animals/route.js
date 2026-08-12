import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Animal from '@/models/Animal';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    if (includeAll && !(await requireAdmin())) return unauthorizedResponse();
    
    const query = includeAll ? {} : { published: true };
    const animals = await Animal.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: animals }, {
      headers: { 'Cache-Control': 'no-store' }
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
    const animal = await Animal.create(body);
    return NextResponse.json({ success: true, data: animal }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
