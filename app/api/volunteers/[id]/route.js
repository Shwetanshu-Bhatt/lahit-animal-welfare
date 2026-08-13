import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';
import User from '@/models/User';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-api';
import { apiErrorResponse } from '@/lib/api-error';
import { sendMail, isMailConfigured } from '@/lib/mailer';
import { createResetToken, getAppUrl } from '@/lib/password-reset';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const volunteer = await Volunteer.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

async function sendVolunteerInvite(volunteer, request) {
  const recipient = volunteer.email.trim().toLowerCase();
  const { token } = await createResetToken({ email: recipient, purpose: 'invite' });
  const setNewPasswordLink = `${getAppUrl(request)}/candidate/reset?token=${token}`;

  let mailSent = false;
  let mailError = null;
  try {
    const result = await sendMail({
      to: recipient,
      subject: 'Your LAHIT volunteer account is ready',
      text: `Hi ${volunteer.name}, your LAHIT volunteer application has been approved. Set your password: ${setNewPasswordLink}`,
      html: `<p>Hi ${volunteer.name},</p><p>Your LAHIT volunteer application has been approved. Click below to set a password and activate your account (valid for 48 hours):</p><p><a href="${setNewPasswordLink}">Set your password</a></p>`,
    });
    mailSent = !result?.dev;
  } catch (err) {
    console.error('Failed to notify volunteer:', err);
    mailError = err;
  }

  return { setNewPasswordLink, mailSent, mailError };
}

export async function PATCH(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (body?.action === 'approve') {
      const volunteer = await Volunteer.findById(id);
      if (!volunteer) {
        return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
      }

      let user = await User.findOne({ email: volunteer.email });
      if (user && user.role !== 'volunteer') {
        return NextResponse.json({ success: false, error: 'This email already belongs to an admin account.' }, { status: 409 });
      }
      if (!user) {
        const temporaryPasswordHash = await bcrypt.hash(randomBytes(32).toString('hex'), 12);
        user = new User({
          name: volunteer.name,
          email: volunteer.email,
          password: temporaryPasswordHash,
          role: 'volunteer',
        });
        await user.save();
      }

      const { setNewPasswordLink, mailSent, mailError } = await sendVolunteerInvite(volunteer, request);

      if (mailError && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ success: false, error: 'The volunteer was not notified because email delivery failed.' }, { status: 502 });
      }

      if (volunteer.status !== 'approved') {
        volunteer.status = 'approved';
        await volunteer.save();
      }

      return NextResponse.json({
        success: true,
        data: {
          approved: true,
          email: volunteer.email,
          userRole: user.role,
          mailSent,
          ...(!isMailConfigured() && process.env.NODE_ENV !== 'production' ? { setNewPasswordLink } : {}),
        },
      });
    }

    if (body?.action === 'resend-invite') {
      const volunteer = await Volunteer.findById(id);
      if (!volunteer) {
        return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
      }
      const existingUser = await User.findOne({ email: volunteer.email.trim().toLowerCase() });
      if (volunteer.status !== 'approved' || !existingUser || existingUser.role !== 'volunteer') {
        return NextResponse.json({ success: false, error: 'This volunteer has not been approved yet.' }, { status: 409 });
      }

      const { setNewPasswordLink, mailSent, mailError } = await sendVolunteerInvite(volunteer, request);
      if (mailError && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ success: false, error: 'Could not re-send the invitation email.' }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        data: {
          resent: true,
          email: volunteer.email,
          mailSent,
          ...(!isMailConfigured() && process.env.NODE_ENV !== 'production' ? { setNewPasswordLink } : {}),
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) return unauthorizedResponse();
    await connectDB();
    const { id } = await params;
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      return NextResponse.json({ success: false, error: 'Volunteer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
