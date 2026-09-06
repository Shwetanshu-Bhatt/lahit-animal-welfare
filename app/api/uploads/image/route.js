import { NextResponse } from 'next/server';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';
import { uploadImageBuffer } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file.arrayBuffer !== 'function' || !file.type?.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Please choose an image file.' }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image files must be smaller than 8 MB.' }, { status: 400 });
    }

    const result = await uploadImageBuffer(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({
      success: true,
      data: { url: result.secure_url, filename: file.name },
    }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
