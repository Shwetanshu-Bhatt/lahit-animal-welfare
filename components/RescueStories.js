'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Container from './ui/Container';
import Card from './ui/Card';
import Button from './ui/Button';
import Image from 'next/image';

function RescueCard({ story, index }) {
  const isFeatured = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={isFeatured ? 'lg:col-span-3' : ''}
    >
      <Card hover={false} className={`rescue-story-card h-full group ${isFeatured ? 'lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-5 lg:p-5' : ''}`} padding="none">
        {/* Before/After Images */}
        <div className={`grid grid-cols-2 gap-1 p-4 pb-0 ${isFeatured ? 'lg:gap-2 lg:p-0' : ''}`}>
          <div className={`relative aspect-square overflow-hidden rounded-xl ${isFeatured ? 'lg:aspect-[4/3]' : ''}`}>
            <div className="absolute top-2 left-2 z-10 rounded-full bg-primary/80 px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white backdrop-blur-sm">
              Before
            </div>
            <Image
              src={story.beforeImage}
              alt={`${story.name} before rescue`}
              fill
              className="rescue-story-image object-cover"
            />
          </div>
          <div className={`relative aspect-square overflow-hidden rounded-xl ${isFeatured ? 'lg:aspect-[4/3]' : ''}`}>
            <div className="absolute top-2 left-2 z-10 rounded-full bg-primary px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white backdrop-blur-sm">
              After
            </div>
            <Image
              src={story.afterImage}
              alt={`${story.name} after recovery`}
              fill
              className="rescue-story-image object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className={`${isFeatured ? 'lg:flex lg:flex-col lg:justify-center lg:p-8' : ''} p-6`}>
          {isFeatured && <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.12em] text-primary">Featured rescue <span className="h-1.5 w-1.5 rounded-full bg-secondary" /></span>}
          <div className="flex items-center gap-4 mb-3 text-sm text-primary/60">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {story.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {story.date}
            </span>
          </div>

          <h3 className={`${isFeatured ? 'text-3xl sm:text-4xl' : 'text-xl'} mb-2 font-bold text-primary`}>
            Meet {story.name}
          </h3>
          <p className="text-primary/70 text-sm leading-relaxed mb-4">
            {story.story}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-base-300">
            <span className="badge badge-primary badge-outline">
              {story.type}
            </span>
            <button className="group/story flex items-center gap-2 text-sm font-bold text-primary">
              <span>Read Story</span>
              <span className="rescue-story-arrow flex h-8 w-8 items-center justify-center rounded-full border border-primary/15"><ArrowRight className="h-4 w-4" /></span>
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function RescueStories() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRescues() {
      try {
        const res = await fetch('/api/rescues');
        const data = await res.json();
        if (data.success) {
          setRescues(data.data);
        } else {
          setError('Failed to load rescues');
        }
      } catch (err) {
        setError('Error loading rescues');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRescues();
  }, []);

  return (
    <section id="rescues" className="section-padding bg-base-200" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="badge badge-secondary badge-outline badge-lg mb-4">
            Success Stories
          </span>
          <h2 className="mb-4 text-[2rem] font-bold tracking-[-0.04em] text-primary sm:text-4xl lg:text-5xl">
            Rescue & Recovery Stories
          </h2>
          <p className="text-lg text-primary/70 max-w-2xl mx-auto">
            Every rescue is a journey of hope. See how your support helps transform 
            injured and abandoned animals into healthy, happy companions.
          </p>
        </motion.div>

        {/* Stories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-primary/60">
            {error}
          </div>
        ) : rescues.length === 0 ? (
          <div className="text-center py-20 text-primary/60">
            No rescue stories available yet.
          </div>
        ) : (
          <div className="grid gap-4 mb-10 sm:grid-cols-2 sm:gap-6 sm:mb-12 lg:grid-cols-3">
            {rescues.map((story, index) => (
              <RescueCard key={story._id || index} story={story} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button
            href="#rescues"
            variant="outline"
            size="lg"
            icon={ArrowRight}
          >
            View All Rescue Stories
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
