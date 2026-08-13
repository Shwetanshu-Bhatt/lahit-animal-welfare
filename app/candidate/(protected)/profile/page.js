'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock, Mail, Save, UserRound } from 'lucide-react';

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/profile/', { cache: 'no-store' }).then((response) => response.json()).then((result) => { if (!result.success) throw new Error(result.error); setProfile(result.data); setName(result.data.name || ''); }).catch((loadError) => setError(loadError.message || 'Could not load your profile.')); }, []);

  async function save(event) {
    event.preventDefault(); setSaving(true); setError(''); setSuccess('');
    try {
      const response = await fetch('/api/profile/', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Could not update profile.');
      setProfile(result.data); setName(result.data.name); setSuccess('Your profile has been updated.');
    } catch (saveError) { setError(saveError.message); } finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-3xl space-y-7"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-secondary">Account settings</p><h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-primary sm:text-4xl">My profile</h2><p className="mt-2 text-sm leading-6 text-primary/55">Keep your contact details up to date so the LAHIT team can reach you.</p></div>{error && <div className="rounded-2xl bg-error/10 p-4 text-sm font-semibold text-error">{error}</div>}{!profile ? <div className="h-80 animate-pulse rounded-[2rem] bg-white/60" /> : <div className="grid gap-6"><form onSubmit={save} className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-4 border-b border-primary/10 pb-6"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-black text-white">{profile.name?.slice(0, 1).toUpperCase()}</span><div><h3 className="text-xl font-black text-primary">Personal details</h3><p className="text-sm text-primary/50">This is how your name appears to the team.</p></div></div><label className="mt-7 block"><span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-primary/55"><UserRound className="h-4 w-4" /> Full name</span><input required value={name} onChange={(event) => setName(event.target.value)} className="h-12 w-full rounded-xl border border-primary/15 bg-base-200 px-4 text-primary outline-none focus:border-primary" /></label><label className="mt-5 block"><span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-primary/55"><Mail className="h-4 w-4" /> Email address</span><input value={profile.email || ''} readOnly className="h-12 w-full cursor-not-allowed rounded-xl border border-primary/10 bg-primary/5 px-4 text-primary/55 outline-none" /><span className="mt-2 block text-xs text-primary/45">Email changes are managed by the LAHIT team to protect your activity history.</span></label>{success && <p className="mt-5 flex items-center gap-2 text-sm font-bold text-green-800"><CheckCircle2 className="h-4 w-4" /> {success}</p>}<button type="submit" disabled={saving} className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-white hover:bg-[#164a36] disabled:opacity-50">{saving ? 'Saving…' : <><Save className="h-4 w-4" /> Save profile</>}</button></form><div className="flex items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8"><div><h3 className="font-black text-primary">Password & security</h3><p className="mt-1 text-sm text-primary/55">Update your sign-in password regularly.</p></div><Link href="/candidate/change-password/" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-primary/15 px-4 text-sm font-black text-primary hover:bg-primary/5"><Lock className="h-4 w-4" /> Change</Link></div></div>}</div>;
}
