import { Suspense } from 'react';
import PasswordResetPage from '@/components/PasswordResetPage';

export default function AdminResetPassword() {
  return (
    <Suspense fallback={<div className="text-sm text-primary/60">Loading…</div>}>
      <PasswordResetPage audience="admin" />
    </Suspense>
  );
}
