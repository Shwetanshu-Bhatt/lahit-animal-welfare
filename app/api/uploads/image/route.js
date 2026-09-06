import { NextResponse } from 'next/server';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';
import { createImageUploadSignature } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST() {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    return NextResponse.json({
      success: true,
      data: createImageUploadSignature(),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
