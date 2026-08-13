import { Suspense } from 'react';
import PasswordResetPage from '@/components/PasswordResetPage';

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="text-sm text-primary/60">Loading…</div>}>
      <PasswordResetPage audience="volunteer" />
    </Suspense>
  );
}
