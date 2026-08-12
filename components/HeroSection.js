'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Heart, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Container from './ui/Container';
import Button from './ui/Button';

export default function HeroSection() {
  const [stats, setStats] = useState({ animalsRescued: 1200, volunteers: 50 });

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => { if (data.success) setStats(data.data); })
      .catch(() => {});
  }, []);

  const heroStats = [
    { value: `${Number(stats.animalsRescued || 0).toLocaleString()}+`, label: 'lives rescued' },
    { value: `${Number(stats.volunteers || 0).toLocaleString()}+`, label: 'active volunteers' },
    { value: '24/7', label: 'rescue response' },
  ];
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-primary text-white">
      <Image
        src="/images/rescue-hero-v2.webp"
        alt="A LAHIT volunteer caring for a rescued dog in Uttarakhand"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center] sm:object-[68%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,28,19,0.96)_0%,rgba(4,28,19,0.87)_38%,rgba(4,28,19,0.24)_72%,rgba(4,28,19,0.12)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,28,19,0.9)_0%,transparent_40%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#fff_0.7px,transparent_0.7px)] [background-size:7px_7px]" />

      <Container className="relative z-10 flex min-h-[100svh] flex-col pt-28 pb-24 sm:pt-36 lg:pt-44 lg:pb-5">
        <div className="my-auto max-w-4xl py-8 sm:pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="eyebrow mb-5 text-accent sm:mb-7"
          >
            Animal rescue · Uttarakhand
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="display-title max-w-4xl text-[3.15rem] uppercase min-[380px]:text-[3.55rem] sm:text-[5.7rem] lg:text-[7.6rem] xl:text-[8.4rem]"
          >
            Every life
            <span className="block text-accent">deserves</span>
            a rescue.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="mt-6 flex max-w-3xl flex-col gap-5 border-t border-white/25 pt-5 sm:mt-8 sm:gap-7 sm:pt-7 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-xl text-sm leading-relaxed text-white/78 sm:text-lg">
              LAHIT brings emergency rescue, treatment, feeding and adoption together—so animals in distress get a real second chance.
            </p>
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:gap-3">
              <Button href="#emergency" variant="accent" size="lg" icon={Phone}>
                <span className="sm:hidden">Report</span><span className="hidden sm:inline">Report a rescue</span>
              </Button>
              <Button href="#donate" variant="outlineWhite" size="lg" icon={Heart}>
                <span className="sm:hidden">Support</span><span className="hidden sm:inline">Give support</span>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45 }}
          className="grid grid-cols-3 overflow-hidden rounded-[1.35rem] border border-white/20 bg-white/10 backdrop-blur-xl md:grid-cols-[1.4fr_1fr_1fr_1fr] md:rounded-[1.6rem]"
        >
          <a href="#about" className="group col-span-3 flex min-h-16 items-center justify-between gap-5 border-b border-white/15 px-4 py-3 md:col-span-1 md:min-h-28 md:border-r md:border-b-0 md:px-6 md:py-5 lg:px-8">
            <div>
              <span className="eyebrow text-[0.64rem] text-white/55">Our impact</span>
              <p className="mt-2 font-bold">See what compassion can do</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-transform group-hover:translate-y-1">
              <ArrowDown className="h-5 w-5" />
            </span>
          </a>
          {heroStats.map((stat) => (
            <div key={stat.label} className="flex min-h-20 flex-col justify-center border-r border-white/15 px-3 py-3 last:border-r-0 md:min-h-24 md:flex-row md:items-center md:gap-4 md:px-6 md:py-5 lg:px-8">
              <p className="text-lg font-black tracking-[-0.05em] text-accent min-[380px]:text-xl sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[0.56rem] font-semibold uppercase leading-tight tracking-[0.08em] text-white/60 md:mt-0 md:max-w-20 md:text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-3 hidden items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-white/55 sm:flex">
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Dehradun, Uttarakhand</span>
          <a href="/animals" className="hidden items-center gap-2 transition-colors hover:text-accent sm:flex">Meet animals waiting for home <ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </Container>
    </section>
  );
}
