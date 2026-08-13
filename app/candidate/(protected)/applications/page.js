'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, PawPrint } from 'lucide-react';

const labels = { new: 'Received', contacted: 'Contacted', screening: 'Screening', approved: 'Approved', rejected: 'Closed' };
const classes = { new: 'bg-secondary/10 text-secondary', contacted: 'bg-blue-500/10 text-blue-700', screening: 'bg-amber-500/10 text-amber-700', approved: 'bg-success/15 text-green-800', rejected: 'bg-error/10 text-error' };

function dateLabel(value) { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)); }

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetch('/api/candidate/applications/', { cache: 'no-store' }).then((response) => response.json()).then((result) => { if (!result.success) throw new Error(result.error); setApplications(result.data); }).catch((loadError) => setError(loadError.message || 'Could not load applications.')); }, []);

  return <div className="space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-secondary">Adoption journey</p><h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-primary sm:text-4xl">My applications</h2><p className="mt-2 max-w-xl text-sm leading-6 text-primary/55">Follow every adoption application you have sent to the LAHIT team.</p></div><Link href="/animals/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-white hover:bg-[#164a36]"><PawPrint className="h-4 w-4" /> Browse animals</Link></div>
    {error && <div className="rounded-2xl bg-error/10 p-4 text-sm font-semibold text-error">{error}</div>}
    {!applications ? <div className="h-72 animate-pulse rounded-[2rem] bg-white/60" /> : applications.length === 0 ? <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm"><PawPrint className="mx-auto h-10 w-10 text-primary/25" /><h3 className="mt-4 text-xl font-black text-primary">No applications yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-primary/55">When you find the right companion, your application and its progress will show up here.</p><Link href="/animals/" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-white">Find a friend <ArrowUpRight className="h-4 w-4" /></Link></div> : <div className="grid gap-4 lg:grid-cols-2">{applications.map((application) => <article key={application._id} className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-7"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-black uppercase tracking-[0.14em] text-secondary">Adoption application</span><h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-primary">{application.animalName}</h3></div><span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${classes[application.status] || 'bg-primary/10 text-primary'}`}>{labels[application.status] || application.status}</span></div><div className="mt-6 grid grid-cols-2 gap-4 border-y border-primary/10 py-5 text-sm"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary/40">Submitted</p><p className="mt-1 font-bold text-primary">{dateLabel(application.createdAt)}</p></div><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary/40">Home type</p><p className="mt-1 font-bold text-primary">{application.homeType}</p></div></div><p className="mt-5 text-sm leading-6 text-primary/60">The LAHIT team will contact you with the next step. Keep your phone available for screening updates.</p></article>)}</div>}
  </div>;
}
