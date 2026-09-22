'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PasswordResetPage({ audience }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const isAdmin = audience === 'admin';
  const loginPath = '/login/';
  const forgotPath = isAdmin ? '/admin/forgot/' : '/candidate/forgot/';
  const [checking, setChecking] = useState(Boolean(token));
  const [valid, setValid] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <main className="flex min-h-screen items-center justify-center bg-[#f3f0e8] px-5 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-[2rem] border border-primary/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(11,51,36,0.1)] backdrop-blur-xl sm:p-9">
          <div className="mb-8 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-black text-accent">L</span><span><strong className="block text-xl tracking-[-0.04em] text-primary">LAHIT</strong><small className="font-bold uppercase tracking-[0.15em] text-primary/45">{isAdmin ? 'Admin workspace' : 'Volunteer workspace'}</small></span></div>
          <div className="space-y-5">
            <div><span className="admin-eyebrow">Secure access</span><h2 className="text-3xl font-black tracking-[-0.05em] text-primary">{!token || valid ? 'Reset password' : 'Link expired or invalid'}</h2></div>
            <p className="text-sm leading-relaxed text-primary/60">{checking ? 'Checking link…' : error || 'A valid reset link is required.'}</p>
            {!checking && <Link href={forgotPath} className="flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-center font-bold text-white transition-colors hover:bg-[#164a36]">Request a new code</Link>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f0e8] px-5 py-10 sm:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-primary/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(11,51,36,0.1)] backdrop-blur-xl sm:p-9">
        <div className="mb-8 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-black text-accent">L</span><span><strong className="block text-xl tracking-[-0.04em] text-primary">LAHIT</strong><small className="font-bold uppercase tracking-[0.15em] text-primary/45">{isAdmin ? 'Admin workspace' : 'Volunteer workspace'}</small></span></div>
        <div className="space-y-5">
          <div><span className="admin-eyebrow">Secure access</span><h2 className="text-3xl font-black tracking-[-0.05em] text-primary">{otpVerified ? 'Set new password' : 'Verify your email'}</h2><p className="mt-3 text-sm leading-relaxed text-primary/55">{otpVerified ? 'Choose a strong password with at least 6 characters.' : 'Enter the six-digit code sent to your email.'}</p></div>
          {error && <div className="rounded-2xl border border-error/20 bg-error/10 p-3 text-sm font-semibold text-error">{error}</div>}
          {success && <div className="rounded-2xl border border-success/20 bg-success/10 p-3 text-sm font-semibold text-success">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
        {requiresOtp && !otpVerified ? (
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">Six-digit code</span>
            <span className="relative block">
              <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
              <input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} className="h-14 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-4 text-primary outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/8" placeholder="Enter code from email" required />
            </span>
          </label>
        ) : (
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">New password</span>
            <span className="relative block">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
              <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="h-14 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-12 text-primary outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/8" placeholder="At least 6 characters" required />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 transition-colors hover:text-primary" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </span>
          </label>
        )}
        <button type="submit" disabled={submitting} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-white transition-colors hover:bg-[#164a36] disabled:opacity-50">
          {submitting ? 'Working…' : requiresOtp && !otpVerified ? 'Verify code' : 'Set password'}
        </button>
          </form>
          <Link href={loginPath} className="block text-center text-sm font-bold text-primary/55 transition-colors hover:text-primary">← Back to sign in</Link>
        </div>
      </div>
    </main>
  );
}
