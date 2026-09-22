import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
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
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    
    let query = {};
    if (!includeAll) {
      query.published = true;
    }
    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (slug) {
      query.slug = slug;
    }
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ success: true, data: blogs }, {
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
    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
