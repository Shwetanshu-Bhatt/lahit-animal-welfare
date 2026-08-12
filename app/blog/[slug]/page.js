'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/ui/Container';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setPost(data.data[0] || null); })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <main className="public-page min-h-screen bg-base-100">
      <Navbar />
      {loading ? (
        <div className="flex min-h-screen items-center justify-center bg-primary"><Loader2 className="h-9 w-9 animate-spin text-accent" /></div>
      ) : !post ? (
        <section className="flex min-h-[80vh] items-center bg-primary pt-28 text-white"><Container><span className="eyebrow text-accent">Field note</span><h1 className="display-title mt-7 text-6xl uppercase">Story not found.</h1><Link href="/blog" className="mt-8 inline-flex items-center gap-2 font-bold text-accent"><ArrowLeft className="h-4 w-4" /> Back to stories</Link></Container></section>
      ) : (
        <article>
          <header className="bg-primary pt-32 pb-12 text-white sm:pt-40 sm:pb-16 lg:pt-48 lg:pb-24">
            <Container size="md">
              <Link href="/blog" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-white/55 hover:text-accent"><ArrowLeft className="h-4 w-4" /> All field notes</Link>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">{post.category} · {new Date(post.createdAt).toLocaleDateString()}</p>
              <h1 className="mt-5 text-[2.55rem] font-black leading-[0.98] tracking-[-0.06em] sm:text-7xl">{post.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/65">{post.excerpt}</p>
            </Container>
          </header>
          <Container size="md" className="py-10 sm:py-14 lg:py-20">
            {post.coverImage && <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[1.5rem] sm:mb-12 sm:rounded-[2rem]"><Image src={post.coverImage} alt={post.title} fill priority className="object-cover" /></div>}
            <div className="whitespace-pre-wrap text-base leading-7 text-primary/72 sm:text-lg sm:leading-8">{post.content}</div>
            <div className="mt-12 border-t border-primary/10 pt-6 text-sm font-bold text-primary/45">Written by {post.author}</div>
          </Container>
        </article>
      )}
      <Footer />
    </main>
  );
}
