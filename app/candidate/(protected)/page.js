'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock3, HeartHandshake, PawPrint, Plus, Siren, Sparkles } from 'lucide-react';

const statusLabels = { new: 'Received', contacted: 'Contacted', screening: 'Screening', approved: 'Approved', rejected: 'Closed', reviewing: 'Reviewing', dispatched: 'Team dispatched', resolved: 'Resolved', dismissed: 'Closed' };
const statusClasses = { new: 'bg-secondary/10 text-secondary', contacted: 'bg-blue-500/10 text-blue-700', screening: 'bg-amber-500/10 text-amber-700', approved: 'bg-success/15 text-green-800', rejected: 'bg-error/10 text-error', reviewing: 'bg-amber-500/10 text-amber-700', dispatched: 'bg-blue-500/10 text-blue-700', resolved: 'bg-success/15 text-green-800', dismissed: 'bg-primary/10 text-primary/55' };

function dateLabel(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function Status({ value }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClasses[value] || 'bg-primary/10 text-primary'}`}>{statusLabels[value] || value}</span>;
}

export default function CandidateDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/candidate/dashboard/', { cache: 'no-store' })
      .then((response) => response.json())
      .then((result) => { if (!result.success) throw new Error(result.error); setData(result.data); })
      .catch((loadError) => setError(loadError.message || 'Could not load your dashboard.'));
  }, []);

  if (error) return <div className="rounded-3xl bg-error/10 p-6 font-semibold text-error">{error}</div>;
  if (!data) return <div className="space-y-5"><div className="h-48 animate-pulse rounded-[2rem] bg-white/60" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-3xl bg-white/60" />)}</div></div>;

  const { user, applications, reports, stats } = data;
  const recentActivity = [...applications.map((item) => ({ ...item, kind: 'application', date: item.createdAt })), ...reports.map((item) => ({ ...item, kind: 'report', date: item.createdAt }))].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] bg-primary p-7 text-white shadow-xl sm:p-10">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-2xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-accent"><Sparkles className="h-4 w-4" /> Welcome to your volunteer hub</p>
          <h2 className="max-w-xl text-3xl font-black tracking-[-0.055em] sm:text-5xl">Hi {user?.name?.split(' ')[0] || 'there'}, animals are counting on people like you.</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">Keep track of adoption applications, report animals who need help, and stay close to the impact you are making with LAHIT.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/animals/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 font-black text-primary transition-transform hover:-translate-y-0.5"><PawPrint className="h-4 w-4" /> Meet animals</Link><Link href="/candidate/reports/new/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-5 font-black text-white transition-colors hover:bg-white/10"><Siren className="h-4 w-4" /> Report an emergency</Link></div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><span className="rounded-2xl bg-secondary/10 p-3 text-secondary"><PawPrint className="h-5 w-5" /></span><span className="text-xs font-bold text-primary/40">LIFETIME</span></div><p className="text-3xl font-black text-primary">{stats.totalApplications}</p><p className="mt-1 text-sm font-semibold text-primary/55">Adoption applications</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><span className="rounded-2xl bg-amber-500/10 p-3 text-amber-700"><Clock3 className="h-5 w-5" /></span><span className="text-xs font-bold text-primary/40">IN PROGRESS</span></div><p className="text-3xl font-black text-primary">{stats.activeApplications}</p><p className="mt-1 text-sm font-semibold text-primary/55">Active applications</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><span className="rounded-2xl bg-blue-500/10 p-3 text-blue-700"><Siren className="h-5 w-5" /></span><span className="text-xs font-bold text-primary/40">SUBMITTED</span></div><p className="text-3xl font-black text-primary">{stats.totalReports}</p><p className="mt-1 text-sm font-semibold text-primary/55">Rescue reports</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><span className="rounded-2xl bg-success/15 p-3 text-green-800"><HeartHandshake className="h-5 w-5" /></span><span className="text-xs font-bold text-primary/40">OPEN CASES</span></div><p className="text-3xl font-black text-primary">{stats.openReports}</p><p className="mt-1 text-sm font-semibold text-primary/55">Reports needing action</p></div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-secondary">Your activity</p><h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-primary">Recent updates</h3></div><Link href="/candidate/applications/" className="inline-flex items-center gap-1 text-sm font-black text-primary hover:text-secondary">View all <ArrowUpRight className="h-4 w-4" /></Link></div>
          {recentActivity.length === 0 ? <div className="mt-8 rounded-2xl bg-base-200 p-6 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-primary/30" /><p className="mt-3 font-bold text-primary">Your activity will appear here</p><p className="mt-1 text-sm text-primary/55">Start by meeting an animal or reporting one that needs help.</p></div> : <div className="mt-6 divide-y divide-primary/10">{recentActivity.map((item) => <div key={`${item.kind}-${item._id}`} className="flex items-center gap-4 py-4 first:pt-0"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.kind === 'application' ? 'bg-secondary/10 text-secondary' : 'bg-blue-500/10 text-blue-700'}`}>{item.kind === 'application' ? <PawPrint className="h-5 w-5" /> : <Siren className="h-5 w-5" />}</span><div className="min-w-0 flex-1"><p className="truncate font-bold text-primary">{item.kind === 'application' ? `Application for ${item.animalName}` : `${item.animalType} rescue report`}</p><p className="mt-1 text-xs text-primary/50">{dateLabel(item.date)}</p></div><Status value={item.status} /></div>)}</div>}
        </section>

        <section className="rounded-[2rem] bg-[#dfff62] p-6 shadow-sm sm:p-8"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white"><Plus className="h-6 w-6" /></span><h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-primary">There is always more we can do together.</h3><p className="mt-3 text-sm leading-6 text-primary/70">Whether it is finding a forever home or helping an animal in an emergency, your next action can change a life.</p><Link href="/candidate/reports/new/" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-white hover:bg-[#164a36]">Make an impact <ArrowUpRight className="ml-2 h-4 w-4" /></Link></section>
      </div>
    </div>
  );
}
