'use client';

import { Loader2 } from 'lucide-react';

export default function SettingsLoading() {
  return (
    <div className="p-8">
      <div className="h-10 w-64 bg-[#401E01]/10 rounded animate-pulse mb-8" />
      
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="h-8 w-48 bg-[#401E01]/10 rounded animate-pulse mb-6" />
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-[#401E01]/10 rounded mb-2 animate-pulse" />
              <div className="h-12 w-full bg-[#401E01]/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
