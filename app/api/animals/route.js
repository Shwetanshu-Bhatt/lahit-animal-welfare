import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Animal from '@/models/Animal';
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
    
    const query = includeAll ? {} : { published: true, status: { $in: ['available', 'pending'] } };
    const animals = await Animal.find(query).sort({ createdAt: -1 }).lean();
    const normalizedAnimals = animals.map((animal) => ({
      ...animal,
      published: animal.status === 'adopted' ? false : animal.published
    }));
    
    return NextResponse.json({ success: true, data: normalizedAnimals }, {
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
    const safeBody = { ...body };
    if (safeBody.status === 'adopted') {
      safeBody.published = false;
    }
    const animal = await Animal.create(safeBody);
    return NextResponse.json({ success: true, data: animal }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
