import connectDB from '@/lib/mongodb';
import Rescue from '@/models/Rescue';
import Animal from '@/models/Animal';
import Stat from '@/models/Stat';

async function getStats() {
  await connectDB();
  const rescueCount = await Rescue.countDocuments({ published: true });
  const animalCount = await Animal.countDocuments({ published: true });
  const stats = await Stat.findOne();
  
  return {
    rescues: rescueCount,
    animals: animalCount,
    stats: stats || {},
  };
}

export default async function AdminDashboard() {
  const data = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#401E01] mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-[#401E01]/60 text-sm mb-1">Total Rescues</p>
          <p className="text-3xl font-bold text-[#164020]">{data.rescues}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-[#401E01]/60 text-sm mb-1">Animals for Adoption</p>
          <p className="text-3xl font-bold text-[#164020]">{data.animals}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-[#401E01]/60 text-sm mb-1">Total Adoptions</p>
          <p className="text-3xl font-bold text-[#164020]">{data.stats.adoptions || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-[#401E01]/60 text-sm mb-1">Volunteers</p>
          <p className="text-3xl font-bold text-[#164020]">{data.stats.volunteers || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#401E01] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/rescues/new" className="block p-4 bg-[#164020]/10 rounded-xl hover:bg-[#164020]/20 transition-colors">
              <p className="font-semibold text-[#164020]">+ Add New Rescue Story</p>
            </a>
            <a href="/admin/animals/new" className="block p-4 bg-[#164020]/10 rounded-xl hover:bg-[#164020]/20 transition-colors">
              <p className="font-semibold text-[#164020]">+ Add New Animal</p>
            </a>
            <a href="/admin/stats" className="block p-4 bg-[#164020]/10 rounded-xl hover:bg-[#164020]/20 transition-colors">
              <p className="font-semibold text-[#164020]">← Update Statistics</p>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#401E01] mb-4">Website Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#401E01]/70">Animals Rescued</span>
              <span className="font-bold text-[#401E01]">{data.stats.animalsRescued || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#401E01]/70">Meals Served</span>
              <span className="font-bold text-[#401E01]">{data.stats.mealsServed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#401E01]/70">Treatments</span>
              <span className="font-bold text-[#401E01]">{data.stats.treatments || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#401E01]/70">Cities Covered</span>
              <span className="font-bold text-[#401E01]">{data.stats.citiesCovered || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
