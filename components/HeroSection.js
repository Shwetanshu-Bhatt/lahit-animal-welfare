'use client';

import { motion } from 'framer-motion';
import { Heart, Phone, ArrowRight } from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#164020]/20 rounded-full blur-3xl animate-float"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#BF7534]/15 rounded-full blur-3xl animate-float-delayed"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#164020]/10 rounded-full blur-3xl animate-float"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          style={{ animationDelay: '-3s' }}
        />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#164020]/10 rounded-full mb-6"
            >
              <Heart className="w-4 h-4 text-[#164020]" fill="#164020" />
              <span className="text-sm font-medium text-[#164020]">
                Serving Uttarakhand since 2020
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#401E01] leading-tight mb-6"
            >
              Helping Stray Animals in{' '}
              <span className="text-[#164020]">Uttarakhand</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-[#401E01]/80 mb-4 font-medium"
            >
              Rescue • Treatment • Feeding • Adoption
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base text-[#401E01]/70 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              We are a volunteer-led initiative dedicated to rescuing, rehabilitating, 
              and rehoming injured and abandoned animals across Uttarakhand.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                href="#emergency"
                variant="accent"
                size="lg"
                icon={Phone}
                className="w-full sm:w-auto"
              >
                Report Injured Animal
              </Button>
              <Button
                href="#donate"
                variant="outline"
                size="lg"
                icon={ArrowRight}
                className="w-full sm:w-auto"
              >
                Support the Mission
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 pt-8 border-t border-[#401E01]/10"
            >
              <div>
                <p className="text-2xl font-bold text-[#164020]">1200+</p>
                <p className="text-sm text-[#401E01]/70">Animals Rescued</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#164020]">50+</p>
                <p className="text-sm text-[#401E01]/70">Active Volunteers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#164020]">24/7</p>
                <p className="text-sm text-[#401E01]/70">Emergency Support</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image Container */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#401E01]/30 to-transparent z-10" />
                <Image
                  src="/images/hero-dog.jpg"
                  alt="Rescued dog receiving care"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>

              {/* Floating Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#164020]/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#164020]" fill="#164020" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#401E01]">Bruno Rescued</p>
                    <p className="text-xs text-[#401E01]/60">3 days ago in Dehradun</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute top-8 -right-4 bg-white rounded-2xl p-4 shadow-xl z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-[#BF7534] rounded-full border-2 border-white" />
                    <div className="w-8 h-8 bg-[#164020] rounded-full border-2 border-white" />
                    <div className="w-8 h-8 bg-[#401E01] rounded-full border-2 border-white" />
                  </div>
                  <p className="text-sm font-medium text-[#401E01]">+50 Volunteers</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
