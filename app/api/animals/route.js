import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Animal from '@/models/Animal';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    
    const query = includeAll ? {} : { published: true };
    const animals = await Animal.find(query).sort({ createdAt: -1 });
    
    // Cache public data for 60 seconds
    const cacheControl = includeAll 
      ? 'no-store, must-revalidate'  
      : 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';
    
    return NextResponse.json({ success: true, data: animals }, {
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
    const animal = await Animal.create(body);
    return NextResponse.json({ success: true, data: animal }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
