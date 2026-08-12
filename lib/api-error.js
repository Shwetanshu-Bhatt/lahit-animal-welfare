import { NextResponse } from 'next/server';

export function apiErrorResponse(error) {
  if (error?.name === 'ValidationError' || error?.name === 'CastError') {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  if (error?.code === 11000) {
    return NextResponse.json({ success: false, error: 'A record with these details already exists.' }, { status: 409 });
  }

  return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
}
