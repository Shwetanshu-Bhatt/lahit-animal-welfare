import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Media from '@/models/Media';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const media = await Media.find({ type: 'image' })
      .select('filename url alt category createdAt')
      .sort({ createdAt: 1 })
      .lean();
    const normalizedMedia = media.map((item) => ({
      ...item,
      category: ['hero', 'volunteer'].includes(item.category)
        ? item.category
        : /volunteer/i.test(item.filename)
          ? 'volunteer'
          : 'unused',
    }));
    const volunteerImages = normalizedMedia.filter((item) => item.category === 'volunteer');

    return NextResponse.json({
      success: true,
      data: {
        hero: normalizedMedia.filter((item) => item.category === 'hero'),
        volunteer: volunteerImages.at(-1) || null,
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
