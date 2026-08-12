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
      className={`fixed top-0 left-0 right-0 z-50 navbar transition-all duration-300 ${
        isScrolled ? 'bg-base-100/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <Container>
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
          <div className="dropdown lg:hidden">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300"
                >
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                  <li>
                    <Button
                      href="#donate"
                      variant="primary"
                      size="sm"
                      icon={Heart}
                      className="w-full mt-2"
                    >
                      Donate Now
                    </Button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
