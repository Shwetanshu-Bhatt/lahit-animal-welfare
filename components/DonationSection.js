'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Utensils, 
  Syringe, 
  HeartPulse, 
  Ambulance, 
  Check, 
  Copy,
  Wallet,
  Building2,
  Loader2
} from 'lucide-react';
import Container from './ui/Container';
import Card from './ui/Card';
import Button from './ui/Button';

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
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const upiId = settings?.upiId && settings.upiId !== 'lahit@upi' ? settings.upiId : '';
  const bankDetails = {
    accountName: settings?.bankAccountName || '',
    accountNumber: settings?.bankAccountNumber || '',
    ifscCode: settings?.bankIfscCode || '',
    bankName: settings?.bankName || '',
    branch: settings?.bankBranch || '',
  };
  const bankConfigured = Boolean(bankDetails.accountNumber && bankDetails.ifscCode);
  const donationTiers = settings?.donationTiers || [
    { id: 1, amount: 500, title: 'Daily Meals', description: 'Feed stray dogs for a day', icon: 'Utensils', impact: 'Provides nutritious meals for 10 street dogs' },
    { id: 2, amount: 1500, title: 'Vaccination', description: 'Vaccination for one animal', icon: 'Syringe', impact: 'Complete vaccination course for a rescued animal' },
    { id: 3, amount: 3000, title: 'Emergency Treatment', description: 'Emergency treatment support', icon: 'HeartPulse', impact: 'Covers emergency medical treatment and medicines' },
    { id: 4, amount: 5000, title: 'Rescue Mission', description: 'Fund a complete rescue', icon: 'Ambulance', impact: 'Covers rescue, treatment, and rehabilitation' }
  ];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <section id="donate" className="section-padding bg-base-100" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-secondary badge-outline badge-lg mb-4">
            Support Our Cause
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Make a Donation
          </h2>
          <p className="text-lg text-primary/70 max-w-2xl mx-auto">
            Your contribution directly helps us rescue, treat, and care for animals in need. 
            Every donation, no matter the size, makes a difference.
          </p>
        </motion.div>

        {/* Donation Tiers */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                        {Icon && <Icon className="w-8 h-8 text-primary group-hover:text-primary-content transition-colors duration-300" />}
                      </div>

                      <div className="mb-4">
                        <span className="text-sm text-primary/60">₹</span>
                        <span className="text-4xl font-bold text-primary">
                          {tier.amount.toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-primary mb-2">
                        {tier.title}
                      </h3>
                      <p className="text-primary/70 text-sm mb-4">
                        {tier.description}
                      </p>

                      <div className="pt-4 border-t border-base-300">
                        <p className="text-xs text-primary/60 mb-1">Impact:</p>
                        <p className="text-sm text-primary font-medium">
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
              <div className="bg-base-200 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary-content" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Donate via UPI</h3>
                    <p className="text-sm text-primary/60">Quick and easy payment</p>
                  </div>
                </div>

                {upiId ? <div className="bg-base-100 rounded-2xl p-6 mb-6">
                  <p className="text-sm text-primary/60 mb-2">UPI ID</p>
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono text-primary font-semibold">
                      {upiId}
                    </code>
                    <button
                      onClick={() => handleCopy(upiId, 'upi')}
                      className="btn btn-sm btn-ghost gap-1"
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
                </div> : <div className="bg-base-100 rounded-2xl p-6 mb-6 text-sm font-semibold text-primary/60">UPI donations are being configured. Please use bank transfer for now.</div>}

                <p className="text-sm text-primary/70">
                  Open any UPI app (Google Pay, PhonePe, Paytm) and scan or enter the UPI ID to donate.
                </p>
              </div>

              {/* Bank Transfer */}
              <div className="bg-base-200 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary-content" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Bank Transfer</h3>
                    <p className="text-sm text-primary/60">Direct bank donation</p>
                  </div>
                </div>

                <div className="bg-base-100 rounded-2xl p-6 space-y-4">
                  {bankConfigured ? Object.entries(bankDetails).filter(([, value]) => value).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-primary/60 uppercase">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm font-semibold text-primary">{value}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(value, key)}
                        className="btn btn-sm btn-ghost btn-circle"
                      >
                        {copiedText === key ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-primary/60" />
                        )}
                      </button>
                    </div>
                  )) : <p className="text-sm font-semibold text-primary/60">Bank transfer details are being configured. Please contact the team before donating.</p>}
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
              <p className="text-sm text-primary/60">
                Please contact LAHIT after donating so the team can confirm receipt and share an acknowledgement.
              </p>
            </motion.div>
          </>
        )}
      </Container>
    </section>
  );
}
