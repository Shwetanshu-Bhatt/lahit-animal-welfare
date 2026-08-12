import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
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
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    
    const cacheControl = includeAll 
      ? 'no-store, must-revalidate'  
      : 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';
    
    return NextResponse.json({ success: true, data: blogs }, {
      headers: { 'Cache-Control': cacheControl }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
