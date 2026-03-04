'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Utensils, 
  Syringe, 
  HeartPulse, 
  Ambulance, 
  Check, 
  Copy,
  Wallet,
  Building2
} from 'lucide-react';
import Container from './ui/Container';
import Card from './ui/Card';
import Button from './ui/Button';
import { donationTiers } from '@/data/animals';

const iconMap = {
  Utensils,
  Syringe,
  HeartPulse,
  Ambulance,
};

export default function DonationSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [copiedText, setCopiedText] = useState(null);

  const upiId = 'lahit@upi';
  const bankDetails = {
    accountName: 'LAHIT Animal Welfare',
    accountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branch: 'Dehradun Main Branch',
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <section id="donate" className="section-padding bg-white" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#BF7534]/10 text-[#BF7534] rounded-full text-sm font-medium mb-4">
            Support Our Cause
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#401E01] mb-4">
            Make a Donation
          </h2>
          <p className="text-lg text-[#401E01]/70 max-w-2xl mx-auto">
            Your contribution directly helps us rescue, treat, and care for animals in need. 
            Every donation, no matter the size, makes a difference.
          </p>
        </motion.div>

        {/* Donation Tiers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {donationTiers.map((tier, index) => {
            const Icon = iconMap[tier.icon];
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center group" padding="xl">
                  <div className="w-16 h-16 bg-[#164020]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#164020] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#164020] group-hover:text-white transition-colors duration-300" />
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-[#401E01]/60">₹</span>
                    <span className="text-4xl font-bold text-[#401E01]">
                      {tier.amount.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#401E01] mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-[#401E01]/70 text-sm mb-4">
                    {tier.description}
                  </p>

                  <div className="pt-4 border-t border-[#401E01]/10">
                    <p className="text-xs text-[#401E01]/60 mb-1">Impact:</p>
                    <p className="text-sm text-[#164020] font-medium">
                      {tier.impact}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* UPI Payment */}
          <div className="bg-[#F2CDAC] rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#164020] rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#401E01]">Donate via UPI</h3>
                <p className="text-sm text-[#401E01]/60">Quick and easy payment</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <p className="text-sm text-[#401E01]/60 mb-2">UPI ID</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-[#401E01] font-semibold">
                  {upiId}
                </code>
                <button
                  onClick={() => handleCopy(upiId, 'upi')}
                  className="flex items-center gap-1 px-3 py-1 bg-[#164020]/10 text-[#164020] rounded-lg text-sm font-medium hover:bg-[#164020]/20 transition-colors"
                >
                  {copiedText === 'upi' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm text-[#401E01]/70">
              Open any UPI app (Google Pay, PhonePe, Paytm) and scan or enter the UPI ID to donate.
            </p>
          </div>

          {/* Bank Transfer */}
          <div className="bg-[#F2CDAC] rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#401E01] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#401E01]">Bank Transfer</h3>
                <p className="text-sm text-[#401E01]/60">Direct bank donation</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 space-y-4">
              {Object.entries(bankDetails).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#401E01]/60 uppercase">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm font-semibold text-[#401E01]">{value}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(value, key)}
                    className="p-2 hover:bg-[#401E01]/10 rounded-lg transition-colors"
                  >
                    {copiedText === key ? (
                      <Check className="w-4 h-4 text-[#164020]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#401E01]/60" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tax Benefits Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#401E01]/60">
            All donations are eligible for tax benefits under Section 80G. 
            Receipts will be sent to your email within 24 hours.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
