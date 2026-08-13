'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PasswordResetPage({ audience }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const isAdmin = audience === 'admin';
  const loginPath = isAdmin ? '/admin/login/' : '/candidate/login/';
  const forgotPath = isAdmin ? '/admin/forgot/' : '/candidate/forgot/';
  const [checking, setChecking] = useState(Boolean(token));
  const [valid, setValid] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/candidate/reset/verify/?token=${encodeURIComponent(token)}`)
      .then((response) => response.json())
      .then((data) => {
        setValid(Boolean(data.valid));
        setRequiresOtp(Boolean(data.requiresOtp));
        setOtpVerified(Boolean(data.otpVerified));
        if (!data.valid) setError('This reset link is missing or no longer valid.');
      })
      .catch(() => setError('Could not verify this link. Please request a new one.'))
      .finally(() => setChecking(false));
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (requiresOtp && !otpVerified) {
        const response = await fetch('/api/auth/verify-otp/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, otp }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Could not verify code');
        setOtpVerified(true);
        return;
      }

      if (password.length < 6) throw new Error('A password of at least 6 characters is required');
      const response = await fetch('/api/candidate/reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Could not set password');
      setSuccess('Your password has been set. You can now sign in.');
      setTimeout(() => router.push(loginPath), 1200);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!token || checking || !valid) {
    return (
      <div className="space-y-5">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-primary">{!token || valid ? 'Reset password' : 'Link expired or invalid'}</h2>
        <p className="text-sm text-primary/60">{checking ? 'Checking link…' : error || 'A valid reset link is required.'}</p>
        {!checking && <Link href={forgotPath} className="block text-center font-bold text-primary hover:text-primary/70">Request a new code →</Link>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black tracking-[-0.04em] text-primary">{otpVerified ? 'Set new password' : 'Verify your email'}</h2>
      {error && <div className="rounded-xl bg-error/10 p-3 text-sm font-semibold text-error">{error}</div>}
      {success && <div className="rounded-xl bg-base-100 p-3 text-sm font-semibold text-primary">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        {requiresOtp && !otpVerified ? (
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">Six-digit code</span>
            <span className="relative block">
              <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
              <input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} className="h-12 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-4 text-primary outline-none" placeholder="Enter code from email" required />
            </span>
          </label>
        ) : (
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">New password</span>
            <span className="relative block">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
              <input type="password" autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-4 text-primary outline-none" placeholder="At least 6 characters" required />
            </span>
          </label>
        )}
        <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-white disabled:opacity-50">
          {submitting ? 'Working…' : requiresOtp && !otpVerified ? 'Verify code' : 'Set password'}
        </button>
      </form>
      <Link href={loginPath} className="block text-center text-sm font-bold text-primary hover:text-primary/70">← Back to sign in</Link>
    </div>
  );
}
