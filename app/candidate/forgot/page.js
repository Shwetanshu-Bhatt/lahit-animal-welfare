'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
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
      const res = await fetch('/api/candidate/forgot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Something went wrong');
      setSent(true);
      if (data.resetLink) setResetLink(data.resetLink);
      if (data.resetOtp) setResetOtp(data.resetOtp);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black tracking-[-0.04em] text-primary">Forgot password</h2>
      <p className="text-sm text-primary/60">Enter your volunteer email to receive a password reset link.</p>

      {error && <div className="rounded-xl bg-error/10 p-3 text-sm font-semibold text-error">{error}</div>}

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">Email</span>
            <span className="relative block">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-4 text-primary outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/8" placeholder="you@example.com" required />
            </span>
          </label>
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-white transition-colors hover:bg-[#164a36] disabled:opacity-50">
            {loading ? 'Sending…' : <><Send className="h-4 w-4" /> Send reset link</>}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl bg-base-100 p-3 text-sm text-primary">If an account exists, a reset link has been issued.</div>
          {resetLink && (
            <div className="break-all rounded-xl bg-base-100 p-3 text-center text-sm text-accent">
              <Link href={resetLink}>Set your password here</Link>
            </div>
          )}
          {resetOtp && <p className="text-center text-xs text-primary/55">Development code: {resetOtp}</p>}
        </div>
      )}

        <Link href="/login/" className="block text-center text-sm font-bold text-primary hover:text-primary/70">← Back to sign in</Link>
    </div>
  );
}
