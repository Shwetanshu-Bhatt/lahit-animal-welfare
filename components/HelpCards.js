'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, Wallet, AlertCircle, ArrowRight } from 'lucide-react';
import Container from './ui/Container';
import Card from './ui/Card';
import Button from './ui/Button';

const helpOptions = [
  {
    id: 1,
    title: 'Adopt an Animal',
    description: 'Give a loving home to a rescued animal. Browse our available pets ready for adoption.',
    icon: Heart,
    color: '#164020',
    bgColor: 'bg-[#164020]/5',
    buttonText: 'Find a Pet',
    href: '#adopt',
    featured: false,
  },
  {
    id: 2,
    title: 'Volunteer',
    description: 'Join our team of dedicated volunteers. Help with rescues, feeding drives, and events.',
    icon: Users,
    color: '#401E01',
    bgColor: 'bg-[#401E01]/5',
    buttonText: 'Join Us',
    href: '#volunteer',
    featured: false,
  },
  {
    id: 3,
    title: 'Donate',
    description: 'Your donations fund rescue operations, medical treatments, and daily care for animals.',
    icon: Wallet,
    color: '#BF7534',
    bgColor: 'bg-[#BF7534]/5',
    buttonText: 'Donate Now',
    href: '#donate',
    featured: true,
  },
  {
    id: 4,
    title: 'Report Injured Animal',
    description: 'See an animal in distress? Report it to us and our team will respond quickly.',
    icon: AlertCircle,
    color: '#D32F2F',
    bgColor: 'bg-[#D32F2F]/5',
    buttonText: 'Report Now',
    href: '#emergency',
    featured: false,
  },
];

export default function HelpCards() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="help" className="section-padding bg-white" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#164020]/10 text-[#164020] rounded-full text-sm font-medium mb-4">
            Get Involved
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#401E01] mb-4">
            How You Can Help
          </h2>
          <p className="text-lg text-[#401E01]/70 max-w-2xl mx-auto">
            There are many ways to make a difference. Choose how you want to contribute 
            to our mission of helping animals in Uttarakhand.
          </p>
        </motion.div>

        {/* Help Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${option.featured ? 'sm:col-span-2 lg:col-span-1 lg:row-span-1' : ''}`}
              >
                <Card
                  className={`h-full group relative overflow-hidden ${option.featured ? 'ring-2 ring-[#BF7534]' : ''}`}
                  padding="xl"
                >
                  {/* Featured Badge */}
                  {option.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#BF7534] text-white text-xs font-bold rounded-full">
                      Most Needed
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="w-8 h-8" style={{ color: option.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#401E01] mb-3">
                    {option.title}
                  </h3>
                  <p className="text-[#401E01]/70 text-sm leading-relaxed mb-6">
                    {option.description}
                  </p>

                  {/* Button */}
                  <Button
                    href={option.href}
                    variant="ghost"
                    size="sm"
                    className="p-0 hover:bg-transparent group/btn"
                  >
                    <span style={{ color: option.color }} className="font-semibold">
                      {option.buttonText}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                      style={{ color: option.color }}
                    />
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
