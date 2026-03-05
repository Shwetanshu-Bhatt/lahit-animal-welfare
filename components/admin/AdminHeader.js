'use client';

import { Bell, User } from 'lucide-react';

export default function AdminHeader({ user }) {
  return (
    <header className="bg-white border-b border-[#401E01]/10 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#401E01]">Welcome back, {user?.name || 'Admin'}</h2>
        <p className="text-sm text-[#401E01]/60">Manage your website content</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#401E01]/60 hover:text-[#401E01] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#BF7534] rounded-full" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-[#401E01]/10">
          <div className="w-10 h-10 bg-[#164020] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="font-medium text-[#401E01]">{user?.name || 'Admin'}</p>
            <p className="text-xs text-[#401E01]/60 capitalize">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
