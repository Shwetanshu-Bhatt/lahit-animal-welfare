import connectDB from '@/lib/mongodb';
import Rescue from '@/models/Rescue';
import Animal from '@/models/Animal';
import Stat from '@/models/Stat';
import Blog from '@/models/Blog';
import Volunteer from '@/models/Volunteer';

async function getStats() {
  await connectDB();
  const rescueCount = await Rescue.countDocuments({ published: true });
  const animalCount = await Animal.countDocuments({ published: true });
  const blogCount = await Blog.countDocuments({ published: true });
  const volunteerCount = await Volunteer.countDocuments();
  const stats = await Stat.findOne();
  
  return {
    rescues: rescueCount,
    animals: animalCount,
    blogs: blogCount,
    volunteers: volunteerCount,
    stats: stats || {},
  };
}

export default async function AdminDashboard() {
  const data = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-primary/60 text-sm mb-1">Total Rescues</p>
            <p className="text-3xl font-bold text-primary">{data.rescues}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-primary/60 text-sm mb-1">Animals for Adoption</p>
            <p className="text-3xl font-bold text-primary">{data.animals}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-primary/60 text-sm mb-1">Blog Posts</p>
            <p className="text-3xl font-bold text-primary">{data.blogs}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-primary/60 text-sm mb-1">Total Volunteers</p>
            <p className="text-3xl font-bold text-primary">{data.volunteers}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/admin/blogs/new" className="block p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
                <p className="font-semibold text-primary">+ Add New Blog Post</p>
              </a>
              <a href="/admin/rescues/new" className="block p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
                <p className="font-semibold text-primary">+ Add New Rescue Story</p>
              </a>
              <a href="/admin/animals/new" className="block p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
                <p className="font-semibold text-primary">+ Add New Animal</p>
              </a>
              <a href="/admin/media" className="block p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
                <p className="font-semibold text-primary">+ Manage Media Library</p>
              </a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="text-xl font-bold text-primary mb-4">Website Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-primary/70">Animals Rescued</span>
                <span className="font-bold text-primary">{data.stats.animalsRescued || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary/70">Meals Served</span>
                <span className="font-bold text-primary">{data.stats.mealsServed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary/70">Treatments</span>
                <span className="font-bold text-primary">{data.stats.treatments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary/70">Cities Covered</span>
                <span className="font-bold text-primary">{data.stats.citiesCovered || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
