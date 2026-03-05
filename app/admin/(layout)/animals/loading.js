'use client';

import { Loader2 } from 'lucide-react';

export default function AnimalsLoading() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 w-64 bg-[#401E01]/10 rounded animate-pulse" />
        <div className="h-12 w-44 bg-[#164020]/10 rounded animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="h-6 w-32 bg-[#401E01]/10 rounded mb-4 animate-pulse" />
            <div className="h-4 w-full bg-[#401E01]/10 rounded mb-2 animate-pulse" />
            <div className="h-4 w-2/3 bg-[#401E01]/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
