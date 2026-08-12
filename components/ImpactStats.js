'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Utensils, Stethoscope, Home } from 'lucide-react';
import Container from './ui/Container';
import Card from './ui/Card';

const iconMap = {
  Heart,
  Utensils,
  Stethoscope,
  Home,
};

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function ImpactStats() {
  const [stats, setStats] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          animalsRescued: 1200,
          mealsServed: 30000,
          treatments: 500,
          adoptions: 200
        });
      }
    }
    fetchStats();
  }, []);

  const impactStats = stats ? [
    {
      id: 1,
      value: stats.animalsRescued || 0,
      suffix: '+',
      label: 'Animals Rescued',
      icon: 'Heart'
    },
    {
      id: 2,
      value: stats.mealsServed || 0,
      suffix: '+',
      label: 'Meals Served',
      icon: 'Utensils'
    },
    {
      id: 3,
      value: stats.treatments || 0,
      suffix: '+',
      label: 'Treatments',
      icon: 'Stethoscope'
    },
    {
      id: 4,
      value: stats.adoptions || 0,
      suffix: '+',
      label: 'Adoptions',
      icon: 'Home'
    }
  ] : [
    { id: 1, value: 0, suffix: '+', label: 'Animals Rescued', icon: 'Heart' },
    { id: 2, value: 0, suffix: '+', label: 'Meals Served', icon: 'Utensils' },
    { id: 3, value: 0, suffix: '+', label: 'Treatments', icon: 'Stethoscope' },
    { id: 4, value: 0, suffix: '+', label: 'Adoptions', icon: 'Home' }
  ];

  return (
    <section id="about" className="section-padding bg-base-100" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary badge-outline badge-lg mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Making a Difference
          </h2>
          <p className="text-lg text-primary/70 max-w-2xl mx-auto">
            Every number represents a life saved, a meal served, and a second chance given to animals in need.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactStats.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full" padding="xl">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="text-primary/70 font-medium">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Impact Story */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-primary rounded-3xl p-8 sm:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary-content mb-4">
                Why We Do What We Do
              </h3>
              <p className="text-primary-content/90 mb-6 leading-relaxed">
                Uttarakhand faces a significant challenge with stray animals. Many are injured, 
                malnourished, or abandoned. LAHIT was born from a simple belief: every animal 
                deserves compassion and care.
              </p>
              <p className="text-primary-content/90 leading-relaxed">
                Our team of dedicated volunteers works around the clock to rescue animals in 
                distress, provide medical treatment, ensure daily feeding, and find loving 
                forever homes through adoption.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-content/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-primary-content mb-1">{stats?.citiesCovered || 15}+</p>
                <p className="text-primary-content/80 text-sm">Cities Covered</p>
              </div>
              <div className="bg-primary-content/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-primary-content mb-1">{stats?.volunteers || 50}+</p>
                <p className="text-primary-content/80 text-sm">Volunteers</p>
              </div>
              <div className="bg-primary-content/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-primary-content mb-1">{stats?.partnerVets || 10}+</p>
                <p className="text-primary-content/80 text-sm">Partner Vets</p>
              </div>
              <div className="bg-primary-content/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-primary-content mb-1">{stats?.yearsActive || 4}+</p>
                <p className="text-primary-content/80 text-sm">Years Active</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
