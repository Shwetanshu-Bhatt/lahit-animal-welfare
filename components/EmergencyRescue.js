'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Camera, MapPin, Send, MessageCircle, X } from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';
import { useForm } from 'react-hook-form';

export default function EmergencyRescue() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/rescues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          type: data.type || 'Other',
          location: data.location,
          story: data.description,
          date: new Date().toISOString().split('T')[0],
          beforeImage: data.image || '',
          published: false
        })
      });
      
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setIsFormOpen(false);
          reset();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappNumber = '+919876543210'; // Replace with actual number
  const whatsappMessage = encodeURIComponent('Emergency: I found an injured animal that needs help. Please respond quickly.');

  return (
    <section
      id="emergency"
      className="section-padding bg-[#BF7534] relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              24/7 Emergency Service
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Found an Injured Animal?
            </h2>

            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              If you come across an injured, sick, or distressed animal, 
              please report it immediately. Our rescue team is available 
              around the clock to help animals in need across Uttarakhand.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Take a Photo</h4>
                  <p className="text-white/80 text-sm">
                    Click a clear picture of the animal and its surroundings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Share Location</h4>
                  <p className="text-white/80 text-sm">
                    Send us the exact location where the animal was found
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Quick Response</h4>
                  <p className="text-white/80 text-sm">
                    Our volunteers will try to reach as soon as possible
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                variant="outlineWhite"
                size="lg"
                icon={Send}
                className="border-2 border-white"
              >
                Report Rescue
              </Button>
              <Button
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                variant="primary"
                size="lg"
                icon={MessageCircle}
                className="bg-[#25D366] hover:bg-[#128C7E] border-none"
              >
                WhatsApp Rescue Team
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Illustration/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              {/* Emergency Contact Card */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#BF7534]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-[#BF7534]" />
                </div>
                <h3 className="text-2xl font-bold text-[#401E01] mb-2">
                  Emergency Hotline
                </h3>
                <p className="text-[#401E01]/70 mb-4">
                  Available 24/7 for animal emergencies
                </p>
                <a
                  href="tel:+919876543210"
                  className="text-3xl font-bold text-[#BF7534] hover:text-[#E65100] transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#401E01]/10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#164020]">{'<30'}</p>
                  <p className="text-sm text-[#401E01]/70">Min Avg Response</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#164020]">50+</p>
                  <p className="text-sm text-[#401E01]/70">Active Volunteers</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-[#164020] text-white px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-semibold">We are here to help!</span>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Report Form Modal */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFormOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#164020] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#401E01] mb-2">
                  Report Submitted!
                </h3>
                <p className="text-[#401E01]/70">
                  Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#401E01]">
                    Report Injured Animal
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-[#401E01]/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-[#401E01]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#401E01] mb-1">
                      Your Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-[#401E01]/20 focus:border-[#164020] focus:ring-2 focus:ring-[#164020]/20 outline-none transition-all"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#401E01] mb-1">
                      Phone Number
                    </label>
                    <input
                      {...register('phone', { required: 'Phone is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-[#401E01]/20 focus:border-[#164020] focus:ring-2 focus:ring-[#164020]/20 outline-none transition-all"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#401E01] mb-1">
                      Location
                    </label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-[#401E01]/20 focus:border-[#164020] focus:ring-2 focus:ring-[#164020]/20 outline-none transition-all"
                      placeholder="Enter the location"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#401E01] mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#401E01]/20 focus:border-[#164020] focus:ring-2 focus:ring-[#164020]/20 outline-none transition-all resize-none"
                      placeholder="Describe the animal and its condition"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    loading={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
