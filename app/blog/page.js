'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/ui/Container';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => { if (data.success) setPosts(data.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-base-200">
      <Navbar />
      <section className="bg-primary pt-40 pb-20 text-white lg:pt-48 lg:pb-28">
        <Container>
          <span className="eyebrow text-accent">From the field</span>
          <h1 className="display-title mt-7 max-w-5xl text-6xl uppercase sm:text-8xl lg:text-9xl">Stories of rescue, recovery and hope.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/62">Updates from the people and animals at the heart of LAHIT.</p>
        </Container>
      </section>
      <section className="section-padding">
        <Container>
          {loading ? (
            <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : posts.length === 0 ? (
            <div className="admin-empty bg-base-100"><BookOpen className="h-8 w-8" /><p>Field notes are coming soon.</p></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-[1.75rem] border border-primary/10 bg-base-100 shadow-[0_14px_50px_rgba(11,51,36,0.06)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-primary/8">
                    {post.coverImage ? <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><BookOpen className="h-10 w-10 text-primary/25" /></div>}
                    <span className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.1em] text-primary">{post.category}</span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary/38">{new Date(post.createdAt).toLocaleDateString()}</p>
                    <h2 className="mt-3 text-2xl font-black tracking-[-0.045em] text-primary">{post.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-primary/58">{post.excerpt}</p>
                    <span className="mt-6 flex items-center justify-between border-t border-primary/10 pt-5 text-sm font-bold text-primary">Read field note <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
      <Footer />
    </main>
  );
}
