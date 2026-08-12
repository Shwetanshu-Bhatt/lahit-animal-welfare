'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, User } from 'lucide-react';

const titles = {
  '/admin': ['Dashboard', 'A live view of the LAHIT mission'],
  '/admin/rescue-reports': ['Rescue inbox', 'Triage incoming emergency reports'],
  '/admin/adoption-inquiries': ['Adoption inbox', 'Review and progress adoption applications'],
  '/admin/animals': ['Animals', 'Manage adoption profiles'],
  '/admin/rescues': ['Rescue stories', 'Publish impact and recovery stories'],
  '/admin/blogs': ['Blog', 'Manage news and field updates'],
  '/admin/media': ['Media library', 'Organize reusable images and files'],
  '/admin/volunteers': ['Volunteers', 'Review community applications'],
  '/admin/stats': ['Impact statistics', 'Keep public numbers accurate'],
  '/admin/settings': ['Site settings', 'Control public contact and donation details'],
  '/admin/profile': ['Profile', 'Manage your admin account'],
};

export default function AdminHeader({ user, onOpenMenu }) {
  const pathname = usePathname();
  const [title, description] = titles[pathname] || ['Admin', 'Manage LAHIT'];

  return (
    <header className="sticky top-0 z-30 flex min-h-24 items-center justify-between border-b border-primary/10 bg-[#f8f6f0]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-4">
        <button type="button" onClick={onOpenMenu} aria-label="Open navigation" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white lg:hidden"><Menu className="h-5 w-5" /></button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-black tracking-[-0.035em] text-primary sm:text-2xl">{title}</h1>
          <p className="hidden text-sm text-primary/48 sm:block">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" target="_blank" className="hidden min-h-10 items-center gap-2 rounded-full border border-primary/15 px-4 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white sm:flex">View website <ArrowUpRight className="h-4 w-4" /></Link>
        <Link href="/admin/profile" className="flex items-center gap-3 rounded-full bg-white py-1.5 pr-3 pl-1.5 shadow-sm ring-1 ring-primary/10">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white"><User className="h-4 w-4" /></span>
          <span className="hidden max-w-28 truncate text-sm font-bold text-primary md:block">{user?.name || 'Admin'}</span>
        </Link>
      </div>
    </header>
  );
}
