'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, CheckCircle2, Send, X, Loader2 } from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

export default function VolunteerSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [volunteerCount, setVolunteerCount] = useState(50);
  const [activities, setActivities] = useState([
    'Animal Rescue Operations',
    'Daily Feeding Drives',
    'Medical Assistance',
    'Adoption Events',
    'Community Awareness',
    'Foster Care',
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          if (data.data.volunteerActivities && data.data.volunteerActivities.length > 0) {
            setActivities(data.data.volunteerActivities);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
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

  return (
    <section id="volunteer" className="section-padding bg-base-200" ref={sectionRef}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                alt="LAHIT Volunteers"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-base-100 rounded-2xl p-6 shadow-xl max-w-xs"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{volunteerCount}+</p>
                  <p className="text-sm text-primary/70">Active Volunteers</p>
                </div>
              </div>
              <p className="text-sm text-primary/70">
                Join our growing community of animal lovers making a difference.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="badge badge-primary badge-outline badge-lg mb-4">
              Join Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Become a Volunteer
            </h2>
            <p className="text-lg text-primary/70 mb-8 leading-relaxed">
              Join our mission to help animals in Uttarakhand. Whether you have 
              an hour a week or can dedicate more time, there's a place for you 
              in our volunteer team.
            </p>

            {/* Activities List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-primary">{activity}</span>
                  </motion.div>
                ))}
              </div>
            )}

            <Button
              onClick={() => setIsFormOpen(true)}
              variant="primary"
              size="lg"
              icon={Users}
            >
              Join as Volunteer
            </Button>
          </motion.div>
        </div>
      </Container>

      {/* Volunteer Form Modal */}
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
                  <CheckCircle2 className="w-8 h-8 text-primary-content" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Application Submitted!
                </h3>
                <p className="text-primary/70">
                  We'll contact you soon with next steps.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-primary">
                    Volunteer Application
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-ghost btn-circle btn-sm"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Full Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input input-bordered w-full"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-error text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="input input-bordered w-full"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email.message}</p>
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
                      City/Location
                    </label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      className="input input-bordered w-full"
                      placeholder="Enter your city"
                    />
                    {errors.location && (
                      <p className="text-error text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Areas of Interest
                    </label>
                    <select
                      {...register('interest', { required: 'Please select an area' })}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select an area</option>
                      {activities.map((activity) => (
                        <option key={activity} value={activity}>
                          {activity}
                        </option>
                      ))}
                    </select>
                    {errors.interest && (
                      <p className="text-error text-sm mt-1">{errors.interest.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      {...register('message')}
                      rows={3}
                      className="textarea textarea-bordered w-full"
                      placeholder="Tell us why you want to volunteer"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
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
