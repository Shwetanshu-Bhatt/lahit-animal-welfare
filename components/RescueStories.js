'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Container from './ui/Container';
import Card from './ui/Card';
import Button from './ui/Button';
import Image from 'next/image';

function RescueCard({ story, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full group" padding="none">
        {/* Before/After Images */}
        <div className="grid grid-cols-2 gap-1 p-4 pb-0">
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-[#401E01]/80 text-white text-xs rounded-full">
              Before
            </div>
            <Image
              src={story.beforeImage}
              alt={`${story.name} before rescue`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-[#164020] text-white text-xs rounded-full">
              After
            </div>
            <Image
              src={story.afterImage}
              alt={`${story.name} after recovery`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-3 text-sm text-[#401E01]/60">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {story.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {story.date}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#401E01] mb-2">
            Meet {story.name}
          </h3>
          <p className="text-[#401E01]/70 text-sm leading-relaxed mb-4">
            {story.story}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-[#401E01]/10">
            <span className="inline-block px-3 py-1 bg-[#164020]/10 text-[#164020] text-sm rounded-full">
              {story.type}
            </span>
            <button className="flex items-center gap-1 text-[#164020] font-medium text-sm hover:gap-2 transition-all">
              Read Story <ArrowRight className="w-4 h-4" />
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
    <section id="rescues" className="section-padding bg-[#F2CDAC]" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#BF7534]/10 text-[#BF7534] rounded-full text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#401E01] mb-4">
            Rescue & Recovery Stories
          </h2>
          <p className="text-lg text-[#401E01]/70 max-w-2xl mx-auto">
            Every rescue is a journey of hope. See how your support helps transform 
            injured and abandoned animals into healthy, happy companions.
          </p>
        </motion.div>

        {/* Stories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#401E01]" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-[#401E01]/60">
            {error}
          </div>
        ) : rescues.length === 0 ? (
          <div className="text-center py-20 text-[#401E01]/60">
            No rescue stories available yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
