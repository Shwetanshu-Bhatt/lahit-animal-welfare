import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stat from '@/models/Stat';
import Volunteer from '@/models/Volunteer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let stats = await Stat.findOne();
    
    // Get actual volunteer count from database
    const volunteerCount = await Volunteer.countDocuments({ status: 'approved' });
    
    // Create default stats if none exist
    if (!stats) {
      stats = await Stat.create({
        animalsRescued: 1200,
        mealsServed: 30000,
        treatments: 500,
        adoptions: 200,
        volunteers: volunteerCount || 50,
        citiesCovered: 15,
        partnerVets: 10,
        yearsActive: 4
      });
    }
    
    // Update stats with actual volunteer count
    const statsData = stats.toObject();
    statsData.volunteers = volunteerCount || stats.volunteers;
    
    return NextResponse.json({ success: true, data: statsData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    body.updatedAt = new Date();
    
    let stats = await Stat.findOne();
    
    if (stats) {
      stats = await Stat.findByIdAndUpdate(stats._id, body, { new: true });
    } else {
      stats = await Stat.create(body);
    }
    
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
