'use client';

import { Loader2 } from 'lucide-react';

export default function VolunteersLoading() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 w-64 bg-[#401E01]/10 rounded animate-pulse" />
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-[#164020]/10 rounded animate-pulse" />
          <div className="h-10 w-24 bg-[#164020]/10 rounded animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#401E01]/10 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-6 w-48 bg-[#401E01]/10 rounded mb-2 animate-pulse" />
                <div className="h-4 w-32 bg-[#401E01]/10 rounded animate-pulse" />
              </div>
              <div className="h-10 w-20 bg-[#401E01]/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
