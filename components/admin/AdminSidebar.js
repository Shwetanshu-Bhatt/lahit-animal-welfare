'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Heart, Dog, BarChart3, Settings, LogOut, Users, FileText, Image as ImageIcon, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import NextImage from 'next/image';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/rescues', label: 'Rescue Stories', icon: Heart },
  { href: '/admin/animals', label: 'Animals', icon: Dog },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { href: '/admin/stats', label: 'Statistics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary text-primary-content flex flex-col">
      <div className="p-6 border-b border-primary-content/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-base-100">
            <NextImage src="/lahit.png" alt="LAHIT" fill className="object-cover" />
          </div>
          <div>
            <p className="font-bold text-lg">LAHIT</p>
            <p className="text-xs text-primary-content/60">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary-content/20 text-primary-content'
                      : 'text-primary-content/70 hover:bg-primary-content/10 hover:text-primary-content'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-primary-content/10">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-primary-content/70 hover:bg-primary-content/10 hover:text-primary-content transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
