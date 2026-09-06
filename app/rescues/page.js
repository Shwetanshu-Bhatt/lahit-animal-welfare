'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Loader2, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/ui/Container';
import PublicSiteGate from '@/components/PublicSiteGate';

function RescueCard({ story, featured = false }) {
  const [imgError, setImgError] = useState({ before: false, after: false });

  return (
    <div className={`overflow-hidden rounded-[1.75rem] border border-primary/10 bg-base-100 shadow-[0_14px_40px_rgba(11,51,36,0.06)] ${featured ? 'lg:grid lg:grid-cols-[1.2fr_0.8fr]' : ''}`}>
      <div className={`grid grid-cols-2 gap-2 p-3 ${featured ? 'lg:p-4' : ''}`}>
        <div className={`relative overflow-hidden rounded-xl ${featured ? 'aspect-[4/3]' : 'aspect-square'}`}>
          <div className="absolute left-2 top-2 z-10 rounded-full bg-primary/80 px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white backdrop-blur-sm">
            Before
          </div>
          {!imgError.before && story.beforeImage ? (
            <Image src={story.beforeImage} alt={`${story.name} before rescue`} fill className="object-cover" onError={() => setImgError(prev => ({ ...prev, before: true }))} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-primary/40">
              <span className="text-xs font-semibold">Image unavailable</span>
            </div>
          )}
        </div>
        <div className={`relative overflow-hidden rounded-xl ${featured ? 'aspect-[4/3]' : 'aspect-square'}`}>
          <div className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white backdrop-blur-sm">
            After
          </div>
          {!imgError.after && story.afterImage ? (
            <Image src={story.afterImage} alt={`${story.name} after recovery`} fill className="object-cover" onError={() => setImgError(prev => ({ ...prev, after: true }))} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-primary/40">
              <span className="text-xs font-semibold">Image unavailable</span>
            </div>
          )}
        </div>
      </div>

      <div className={`p-5 ${featured ? 'lg:flex lg:flex-col lg:justify-center lg:p-7' : ''}`}>
        <div className="mb-3 flex items-center gap-4 text-xs text-primary/60">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{story.location}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{story.date}</span>
        </div>
        <h3 className={`${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'} font-black tracking-[-0.045em] text-primary`}>
          {story.name}
        </h3>
        <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-primary/70">{story.story}</p>

        <div className="mt-5 flex items-center justify-between border-t border-primary/10 pt-4">
          <span className="badge badge-primary badge-outline">{story.type}</span>
          <Link href="/" className="text-sm font-bold text-primary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

export default function RescueStoriesPage() {
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRescues() {
      try {
        const res = await fetch('/api/rescues');
        const data = await res.json();
        if (data.success) setRescues(data.data);
      } catch (error) {
        console.error('Error loading rescue stories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRescues();
  }, []);

  return (
    <PublicSiteGate>
      <main className="public-page min-h-screen bg-base-200">
        <Navbar />
        <section className="bg-primary pt-32 pb-14 text-white sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-28">
          <Container>
            <div className="mb-6 flex items-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-accent">
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>
            </div>
            <span className="eyebrow text-accent">Success stories</span>
            <h1 className="display-title mt-5 max-w-5xl text-[2.9rem] uppercase sm:mt-7 sm:text-6xl lg:text-7xl">Rescue & recovery stories</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
              Every rescue is a turning point. Explore the full journey of care, recovery, and hope.
            </p>
          </Container>
        </section>

        <section className="section-padding">
          <Container>
            {loading ? (
              <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : rescues.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-primary/20 bg-base-100 p-10 text-center text-primary/60">
                No rescue stories available yet.
              </div>
            ) : (
              <div className="space-y-8">
                {rescues[0] && (
                  <div className="mx-auto max-w-5xl">
                    <RescueCard story={rescues[0]} featured />
                  </div>
                )}

                {rescues.length > 1 && (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {rescues.slice(1).map((story) => (
                      <RescueCard key={story._id} story={story} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Container>
        </section>

        <Footer />
      </main>
    </PublicSiteGate>
  );
}
