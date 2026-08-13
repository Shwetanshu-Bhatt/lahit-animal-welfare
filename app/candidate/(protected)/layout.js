import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import CandidateShell from '@/components/candidate/CandidateShell';

export const dynamic = 'force-dynamic';

export default async function ProtectedCandidateLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'volunteer') {
    redirect('/login/');
  }

  return <CandidateShell user={session.user}>{children}</CandidateShell>;
}
