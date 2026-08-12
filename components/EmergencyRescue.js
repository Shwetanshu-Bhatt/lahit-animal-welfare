'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [submitError, setSubmitError] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.contactPhone) setContactPhone(data.data.contactPhone);
      })
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/rescue-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterName: data.name,
          phone: data.phone,
          animalType: data.animalType || 'Other',
          location: data.location,
          description: data.description,
        })
      });
      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setIsFormOpen(false);
          reset();
        }, 3000);
      } else setSubmitError(result.error || 'Could not submit the report. Please call us instead.');
    } catch (error) {
      console.error('Error submitting:', error);
      setSubmitError('Could not submit the report. Please call us instead.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappNumber = contactPhone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent('Emergency: I found an injured animal that needs help. Please respond quickly.');

  return (
    <section
      id="emergency"
      className="section-padding bg-secondary relative overflow-hidden"
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
              {whatsappNumber && (
                <Button href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} variant="primary" size="lg" icon={MessageCircle} className="bg-[#25D366] hover:bg-[#128C7E] border-none">
                  WhatsApp Rescue Team
                </Button>
              )}
            </div>
          </motion.div>

          {/* Right Content - Illustration/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-base-100 rounded-3xl p-8 shadow-2xl">
              {/* Emergency Contact Card */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Emergency Hotline
                </h3>
                <p className="text-primary/70 mb-4">
                  Available 24/7 for animal emergencies
                </p>
                {contactPhone ? (
                  <a href={`tel:${contactPhone}`} className="text-3xl font-bold text-secondary hover:text-secondary/80 transition-colors">{contactPhone}</a>
                ) : (
                  <p className="text-sm font-semibold text-secondary">Submit the rescue form for a callback</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-base-300">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{'<30'}</p>
                  <p className="text-sm text-primary/70">Min Avg Response</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-primary/70">Active Volunteers</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-primary text-primary-content px-4 py-2 rounded-full shadow-lg"
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
            className="bg-base-100 rounded-box shadow-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-primary-content" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Report Submitted!
                </h3>
                <p className="text-primary/70">
                  Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-primary">
                    Report Injured Animal
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-ghost btn-circle btn-sm"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {submitError && <div className="alert alert-error text-sm"><span>{submitError}</span></div>}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Your Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input input-bordered w-full"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-error text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Phone Number
                    </label>
                    <input
                      {...register('phone', { required: 'Phone is required' })}
                      className="input input-bordered w-full"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Animal Type
                    </label>
                    <select {...register('animalType')} className="select select-bordered w-full" defaultValue="Other">
                      {['Dog', 'Cat', 'Cow', 'Bird', 'Other'].map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Location
                    </label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      className="input input-bordered w-full"
                      placeholder="Enter the location"
                    />
                    {errors.location && (
                      <p className="text-error text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={3}
                      className="textarea textarea-bordered w-full"
                      placeholder="Describe the animal and its condition"
                    />
                    {errors.description && (
                      <p className="text-error text-sm mt-1">{errors.description.message}</p>
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
