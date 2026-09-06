'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, MapPin, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/ui/Container';
import PublicSiteGate from '@/components/PublicSiteGate';

export default function RescueDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({ before: false, after: false });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/rescues/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setStory(data.data); })
      .finally(() => setLoading(false));
  }, [id]);

  function handleImageError(side) {
    setImageErrors(prev => ({ ...prev, [side]: true }));
  }

  return (
    <PublicSiteGate><main className="public-page min-h-screen bg-base-200">
      <Navbar />
      {loading ? (
        <div className="flex min-h-screen items-center justify-center bg-primary">
          <Loader2 className="h-9 w-9 animate-spin text-accent" />
        </div>
      ) : !story ? (
        <section className="flex min-h-[80vh] items-center bg-primary pt-28 text-white">
          <Container>
            <span className="eyebrow text-accent">Rescue story</span>
            <h1 className="display-title mt-7 text-6xl uppercase">Story not found.</h1>
            <Link href="/rescues" className="mt-8 inline-flex items-center gap-2 font-bold text-accent">
              <ArrowLeft className="h-4 w-4" /> Back to stories
            </Link>
          </Container>
        </section>
      ) : (
        <article>
          <header className="bg-primary pt-32 pb-12 text-white sm:pt-40 sm:pb-16 lg:pt-48 lg:pb-24">
            <Container>
              <Link href="/rescues" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-white/55 hover:text-accent">
                <ArrowLeft className="h-4 w-4" /> All rescue stories
              </Link>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{story.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{story.date}</span>
              </div>
              <h1 className="mt-5 text-[2.55rem] font-black leading-[0.98] tracking-[-0.06em] sm:text-7xl">{story.name}</h1>
              <span className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white">
                {story.type}
              </span>
            </Container>
          </header>

          <Container size="md" className="py-10 sm:py-14 lg:py-20">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-base-300">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-primary/80 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                  Before
                </div>
                {!imageErrors.before && story.beforeImage ? (
                  <Image src={story.beforeImage} alt={`${story.name} before rescue`} fill className="object-cover" onError={() => handleImageError('before')} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary/40">
                    <span className="text-sm font-semibold">Image unavailable</span>
                  </div>
                )}
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-base-300">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                  After
                </div>
                {!imageErrors.after && story.afterImage ? (
                  <Image src={story.afterImage} alt={`${story.name} after recovery`} fill className="object-cover" onError={() => handleImageError('after')} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary/40">
                    <span className="text-sm font-semibold">Image unavailable</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 whitespace-pre-wrap text-base leading-7 text-primary/72 sm:text-lg sm:leading-8">
              {story.story}
            </div>
          </Container>
        </article>
      )}
      <Footer />
    </main></PublicSiteGate>
  );
}
