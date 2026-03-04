'use client';

import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  ArrowUp,
} from 'lucide-react';
import Container from './ui/Container';
import Image from 'next/image';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About Us', href: '#about' },
  { name: 'Rescue Stories', href: '#rescues' },
  { name: 'Adopt', href: '#adopt' },
  { name: 'Volunteer', href: '#volunteer' },
  { name: 'Donate', href: '#donate' },
];

const services = [
  { name: 'Animal Rescue', href: '#emergency' },
  { name: 'Medical Treatment', href: '#about' },
  { name: 'Adoption', href: '#adopt' },
  { name: 'Feeding Programs', href: '#about' },
  { name: 'Sterilization', href: '#about' },
  { name: 'Awareness Camps', href: '#volunteer' },
];

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/lahitanimalwelfare' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/lahitanimalwelfare' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/lahitanimal' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#401E01] text-white">
      {/* Main Footer */}
      <div className="section-padding">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white shadow-md">
                  <Image
                    src="/lahit.png"
                    alt="LAHIT Animal Welfare Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-2xl font-bold">LAHIT</span>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                A volunteer-led animal rescue initiative dedicated to helping 
                stray and injured animals across Uttarakhand, India.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#164020] transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Our Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <a
                      href={service.href}
                      className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:contact@lahitanimalwelfare.org"
                    className="flex items-start gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>contact@lahitanimalwelfare.org</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919876543210"
                    className="flex items-start gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>+91 98765 43210</p>
                      <p className="text-sm text-white/50">Emergency Hotline</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    Rajpur Road, Dehradun<br />
                    Uttarakhand, India 248001
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Disclaimer Bar */}
      <div className="border-t border-white/10 py-6">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              LAHIT Animal Welfare is a volunteer-led animal rescue initiative. 
              We are not a registered NGO yet but operate with full transparency 
              and dedication to animal welfare.
            </p>
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 bg-[#164020] rounded-full flex items-center justify-center hover:bg-[#0F2E18] transition-colors flex-shrink-0"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </Container>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-4">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
            <p>
              © {new Date().getFullYear()} LAHIT Animal Welfare. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
