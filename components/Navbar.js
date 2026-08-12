'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';
import Image from 'next/image';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Rescues', href: '#rescues' },
  { name: 'Adopt', href: '/animals' },
  { name: 'Volunteer', href: '#volunteer' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-base-100/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <Container className="w-full">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-base-100 shadow-md">
              <Image
                src="/lahit.png"
                alt="LAHIT Animal Welfare Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold text-primary">
              LAHIT
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              href="#donate"
              variant="primary"
              size="sm"
              icon={Heart}
            >
              Donate
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative lg:hidden">
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
                isMobileMenuOpen
                  ? 'border-primary bg-primary text-white'
                  : 'border-primary/20 bg-base-100/80 text-primary'
              }`}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.nav
                  id="mobile-navigation"
                  aria-label="Mobile navigation"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-primary p-2 text-white shadow-2xl"
                >
                  <ul className="flex flex-col">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <a
                          href={link.href}
                          className="block rounded-xl px-4 py-3 font-medium text-white transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </a>
                      </motion.li>
                    ))}
                    <li className="mt-2 border-t border-white/15 pt-2">
                      <a
                        href="#donate"
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-primary transition-colors hover:bg-base-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        Donate Now
                      </a>
                    </li>
                  </ul>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
