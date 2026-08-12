import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminShell user={session.user}>{children}</AdminShell>
  );
}
