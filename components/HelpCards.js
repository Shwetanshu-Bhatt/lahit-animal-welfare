'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, ArrowUpRight, Heart, Users, Wallet } from 'lucide-react';
import Container from './ui/Container';

const helpOptions = [
  {
    number: '01',
    title: 'Adopt',
    description: 'Open your home to a rescued animal ready for a safe, loving future.',
    icon: Heart,
    href: '/animals',
    cta: 'Meet the animals',
  },
  {
    number: '02',
    title: 'Volunteer',
    description: 'Put your time and skills where they matter—in rescues, feeding and field support.',
    icon: Users,
    href: '#volunteer',
    cta: 'Join the team',
  },
  {
    number: '03',
    title: 'Donate',
    description: 'Fund medicines, meals, transport and the urgent care every rescue depends on.',
    icon: Wallet,
    href: '#donate',
    cta: 'Give today',
    featured: true,
  },
  {
    number: '04',
    title: 'Report',
    description: 'Found an animal in distress? Send the location and help our response team act fast.',
    icon: AlertCircle,
    href: '#emergency',
    cta: 'Start a rescue',
  },
];

export default function HelpCards() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="help" className="section-padding overflow-hidden bg-primary text-white" ref={sectionRef}>
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}>
            <span className="eyebrow text-accent">Make your move</span>
            <h2 className="display-title mt-5 text-[2.85rem] uppercase sm:mt-7 sm:text-7xl lg:text-8xl">Care is a verb.</h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.08 }} className="max-w-xl text-base leading-relaxed text-white/62 sm:text-lg lg:pb-2">
            Whether you have five minutes, a spare room or the means to fund a treatment, there is a direct way to change an animal’s life today.
          </motion.p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[1.5rem] border border-white/15 sm:mt-14 sm:grid-cols-2 sm:rounded-[2rem] lg:mt-20 lg:grid-cols-4">
          {helpOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.a
                key={option.number}
                href={option.href}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.12 + index * 0.08 }}
                whileHover={{ y: -7 }}
                whileTap={{ scale: 0.985 }}
                data-number={option.number}
                className={`action-card group flex min-h-[300px] flex-col border-b border-white/15 p-6 transition-colors sm:min-h-[390px] sm:border-r sm:p-7 lg:border-b-0 lg:p-8 ${option.featured ? 'bg-accent text-primary' : 'hover:bg-white/[0.06]'} sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black tracking-[0.18em] ${option.featured ? 'text-primary/45' : 'text-white/38'}`}>{option.number}</span>
                  <span className={`action-card-icon flex h-12 w-12 items-center justify-center rounded-full border ${option.featured ? 'border-primary/20' : 'border-white/18'}`}><Icon className="h-5 w-5" /></span>
                </div>
                <div className="mt-auto pt-10 sm:pt-16">
                  <h3 className="text-3xl font-black tracking-[-0.055em] sm:text-4xl">{option.title}</h3>
                  <p className={`mt-4 min-h-20 text-sm leading-relaxed ${option.featured ? 'text-primary/68' : 'text-white/58'}`}>{option.description}</p>
                  <span className={`mt-8 flex items-center justify-between border-t pt-5 text-sm font-bold ${option.featured ? 'border-primary/20' : 'border-white/15'}`}>
                    {option.cta}<ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
