'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import Link from 'next/link';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Something went wrong');
      setSent(true);
      setResetLink(data.resetLink || '');
      setResetOtp(data.resetOtp || '');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary/5 px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        <h1 className="text-3xl font-black tracking-[-0.05em] text-primary">Admin password reset</h1>
        <p className="text-sm text-primary/60">Enter your account email to receive a verification code.</p>
        {error && <div className="rounded-xl bg-error/10 p-3 text-sm font-semibold text-error">{error}</div>}
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">Email</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-4 text-primary outline-none" required />
              </span>
            </label>
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-white disabled:opacity-50">
              {loading ? 'Sending…' : <><Send className="h-4 w-4" /> Send verification code</>}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl bg-base-100 p-3 text-sm text-primary">If an account exists, a verification code has been sent.</div>
            {resetLink && <Link href={resetLink} className="block break-all rounded-xl bg-base-100 p-3 text-center text-sm text-accent">Open reset page</Link>}
            {resetOtp && <p className="text-center text-xs text-primary/55">Development code: {resetOtp}</p>}
          </div>
        )}
        <Link href="/login/" className="block text-center text-sm font-bold text-primary hover:text-primary/70">← Back to sign in</Link>
      </div>
    </main>
  );
}
