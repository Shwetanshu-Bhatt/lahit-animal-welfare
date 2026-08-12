'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Dog, Heart, Menu, Siren, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from './ui/Container';

const navLinks = [
  { name: 'Our impact', href: '/#about' },
  { name: 'Rescues', href: '/#rescues' },
  { name: 'Adopt', href: '/animals' },
  { name: 'Stories', href: '/blog' },
  { name: 'Volunteer', href: '/#volunteer' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const useSolidNav = isScrolled || pathname !== '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
    >
      <Container
        size="xl"
        className={`relative rounded-full border px-4 transition-all duration-300 sm:px-5 ${
          useSolidNav
            ? 'border-primary/10 bg-base-100/95 py-2 text-primary shadow-[0_16px_50px_rgba(11,51,36,0.12)] backdrop-blur-xl'
            : 'border-white/20 bg-primary/20 py-3 text-white backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="LAHIT home">
            <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/30 bg-white shadow-sm">
              <Image src="/lahit.png" alt="" fill className="object-cover" priority />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-black tracking-[-0.04em]">LAHIT</span>
              <span className={`mt-1 hidden text-[0.55rem] font-bold uppercase tracking-[0.17em] sm:block ${useSolidNav ? 'text-primary/55' : 'text-white/55'}`}>
                Animal welfare
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`text-[0.78rem] font-bold transition-colors ${useSolidNav ? 'text-primary/70 hover:text-primary' : 'text-white/72 hover:text-white'}`}>
                {link.name}
              </Link>
            ))}
          </nav>

          <Link href="/#donate" className={`hidden min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition-all hover:-translate-y-0.5 lg:flex ${useSolidNav ? 'bg-primary text-white hover:bg-[#164a36]' : 'bg-accent text-primary hover:bg-white'}`}>
            <Heart className="h-4 w-4" /> Donate <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${useSolidNav ? 'border-primary/15 bg-primary text-white' : 'border-white/25 bg-white/10 text-white'}`}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="absolute inset-x-0 top-[calc(100%+0.65rem)] overflow-hidden rounded-[1.75rem] border border-white/10 bg-primary p-3 text-white shadow-2xl lg:hidden"
            >
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-semibold hover:bg-white/10">
                  {link.name}<ArrowUpRight className="h-4 w-4 text-white/45" />
                </Link>
              ))}
              <Link href="/#donate" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-4 font-bold text-primary">
                <Heart className="h-4 w-4" /> Donate to the mission
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>

      </motion.header>

      <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/10 bg-base-100/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_35px_rgba(11,51,36,0.12)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <Link href="/#emergency" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl bg-secondary text-[0.65rem] font-black uppercase tracking-[0.06em] text-white">
            <Siren className="h-4 w-4" /> Report
          </Link>
          <Link href="/animals" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl bg-primary/7 text-[0.65rem] font-black uppercase tracking-[0.06em] text-primary">
            <Dog className="h-4 w-4" /> Adopt
          </Link>
          <Link href="/#donate" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl bg-accent text-[0.65rem] font-black uppercase tracking-[0.06em] text-primary">
            <Heart className="h-4 w-4" /> Donate
          </Link>
        </div>
      </nav>
    </>
  );
}
