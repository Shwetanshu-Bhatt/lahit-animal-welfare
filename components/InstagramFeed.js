'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram, ExternalLink, Loader2 } from 'lucide-react';
import Container from './ui/Container';
import Image from 'next/image';

function isLikelyImageSource(value = '') {
  if (value.startsWith('data:image/')) return true;
  try {
    const host = new URL(value).hostname.replace('www.', '');
    return !['instagram.com', 'facebook.com', 'youtube.com'].includes(host);
  } catch {
    return false;
  }
}

function InstagramCard({ post, index, instagramUrl }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.a
      href={post.postUrl || instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative aspect-square rounded-2xl overflow-hidden bg-base-200 cursor-pointer"
    >
      {imageFailed ? (
        <div className="flex h-full items-center justify-center bg-primary/8 px-5 text-center text-sm font-semibold text-primary/45">Display image unavailable</div>
      ) : (
        <Image src={post.image} alt={post.caption || 'LAHIT Instagram update'} fill unoptimized onError={() => setImageFailed(true)} className="object-cover transition-transform duration-500 group-hover:scale-110" />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm line-clamp-3">
            {post.caption}
          </p>
        </div>
      </div>

      {/* Instagram Icon */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="w-4 h-4 text-primary" />
      </div>
    </motion.a>
  );
}

export default function InstagramFeed() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/lahitanimalwelfare');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data.instagram) setInstagramUrl(data.data.instagram);
        if (data.success && data.data.instagramPosts && data.data.instagramPosts.length > 0) {
          setInstagramPosts(data.data.instagramPosts);
        } else {
          setInstagramPosts([]);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setInstagramPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const validPosts = instagramPosts.filter((post) => isLikelyImageSource(post.image));

  return (
    <section className="section-padding bg-base-200" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-primary badge-outline badge-lg mb-4">
            <Instagram className="w-4 h-4" />
            Instagram updates
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Follow Our Journey
          </h2>
          <p className="text-lg text-primary/70 max-w-2xl mx-auto">
            See our daily rescue missions, success stories, and behind-the-scenes 
            moments on Instagram.
          </p>
        </motion.div>

        {/* Instagram Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : validPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {validPosts.map((post, index) => (
              <InstagramCard key={post.id || index} post={post} index={index} instagramUrl={instagramUrl} />
            ))}
          </div>
        ) : <div className="mx-auto mb-10 max-w-2xl rounded-[1.75rem] border border-primary/10 bg-base-100 p-8 text-center text-primary/55">New rescue updates are posted on Instagram. Follow LAHIT to see the latest from the field.</div>}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            Follow Us on Instagram
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
