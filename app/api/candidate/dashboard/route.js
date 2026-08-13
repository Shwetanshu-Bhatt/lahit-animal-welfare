import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdoptionInquiry from '@/models/AdoptionInquiry';
import RescueReport from '@/models/RescueReport';
import User from '@/models/User';
import { requireCandidate, candidateUnauthorized } from '@/lib/candidate-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireCandidate();
  if (!session) return candidateUnauthorized();

  try {
    await connectDB();
    const email = session.user.email.toLowerCase();
    const [user, applications, reports] = await Promise.all([
      User.findOne({ email }).select('-password').lean(),
      AdoptionInquiry.find({ email }).sort({ createdAt: -1 }).lean(),
      RescueReport.find({ reporterEmail: email }).select('-image').sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        user,
        applications,
        reports,
        stats: {
          totalApplications: applications.length,
          activeApplications: applications.filter((item) => !['approved', 'rejected'].includes(item.status)).length,
          totalReports: reports.length,
          openReports: reports.filter((item) => !['resolved', 'dismissed'].includes(item.status)).length,
        },
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load dashboard' }, { status: 500 });
  }
}
