import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

function isValidDisplayImage(value = '') {
  if (value.startsWith('data:image/')) return value.length <= 2_000_000;
  try {
    const host = new URL(value).hostname.replace('www.', '');
    return !['instagram.com', 'facebook.com', 'youtube.com'].includes(host);
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        siteName: 'LAHIT - Animal Welfare',
        siteDescription: 'Helping animals in Uttarakhand',
        contactEmail: 'contact@lahit.org',
        contactPhone: '',
        address: '',
        facebook: '',
        instagram: '',
        youtube: '',
        maintenanceMode: false
      });
    }
    
    return NextResponse.json({ success: true, data: settings }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const body = await request.json();
    if (Array.isArray(body.instagramPosts)) {
      if (body.instagramPosts.length > 9) {
        return NextResponse.json({ success: false, error: 'A maximum of 9 homepage Instagram cards is allowed.' }, { status: 400 });
      }
      if (body.instagramPosts.some((post) => !isValidDisplayImage(post.image))) {
        return NextResponse.json({ success: false, error: 'Every Instagram card needs a valid display image, not an Instagram page link.' }, { status: 400 });
      }
      const totalImageSize = body.instagramPosts.reduce((size, post) => size + post.image.length, 0);
      if (totalImageSize > 10_000_000) {
        return NextResponse.json({ success: false, error: 'Instagram display images are too large. Remove cards or use smaller images.' }, { status: 400 });
      }
      body.instagramPosts = body.instagramPosts.map((post) => ({
        id: post.id,
        image: post.image,
        caption: String(post.caption || '').trim(),
        postUrl: String(post.postUrl || '').trim(),
      }));
    }
    body.updatedAt = new Date();
    
    let settings = await Settings.findOne();
    
    if (settings) {
      settings = await Settings.findByIdAndUpdate(settings._id, body, { new: true, runValidators: true });
    } else {
      settings = await Settings.create(body);
    }
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
