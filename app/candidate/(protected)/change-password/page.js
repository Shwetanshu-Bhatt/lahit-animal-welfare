'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword.length < 6) {
      setError('A password of at least 6 characters is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/candidate/change-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not update password');
      setSuccess('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black tracking-[-0.04em] text-primary">Change password</h2>

      {error && <div className="rounded-xl bg-error/10 p-3 text-sm font-semibold text-error">{error}</div>}
      {success && <div className="rounded-xl bg-base-100 p-3 text-sm font-semibold text-primary">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">Current password</span>
          <span className="relative block">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
            <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="h-12 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-10 text-primary outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/8" required />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40" aria-label={showCurrent ? 'Hide' : 'Show'}>{showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-primary/55">New password</span>
          <span className="relative block">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/35" />
            <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-12 w-full rounded-2xl border border-primary/15 bg-white pl-12 pr-10 text-primary outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/8" placeholder="At least 6 characters" required minLength={6} />
            <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40" aria-label={showNew ? 'Hide' : 'Show'}>{showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </span>
        </label>

        <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-white transition-colors hover:bg-[#164a36] disabled:opacity-50">
          {submitting ? 'Saving…' : <><Save className="h-4 w-4" /> Save new password</>}
        </button>
      </form>
    </div>
  );
}
