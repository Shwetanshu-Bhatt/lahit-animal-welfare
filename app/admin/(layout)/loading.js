'use client';

import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#164020]" />
        <p className="text-[#401E01]/60 font-medium">Loading...</p>
      </div>
    </div>
  );
}
