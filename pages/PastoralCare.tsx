import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { PastoralCareRequestRecord } from '../types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import FluidBackground from '../components/FluidBackground';
import CustomCursor from '../components/CustomCursor';

const serviceTypes = [
  { id: 'child-dedication' as const, title: 'Child Dedication', icon: '👶', color: 'from-pink-400 to-rose-400', desc: 'Special service to dedicate your child.' },
  { id: 'house-dedication' as const, title: 'House Dedication', icon: '🏠', color: 'from-blue-400 to-cyan-400', desc: 'Blessing and prayer for your home.' },
  { id: 'business-dedication' as const, title: 'Business Dedication', icon: '🏢', color: 'from-green-400 to-emerald-400', desc: 'Consecrate your business to God.' },
  { id: 'funeral-service' as const, title: 'Funeral Service', icon: '⚰️', color: 'from-gray-400 to-slate-400', desc: 'Compassionate memorial service.' },
];

const PastoralCare: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '' as PastoralCareRequestRecord['serviceType'],
    datePreference: '',
    timePreference: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const selectedService = serviceTypes.find(s => s.id === formData.serviceType);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceSelect = (serviceId: PastoralCareRequestRecord['serviceType']) => {
    setFormData(prev => ({ ...prev, serviceType: serviceId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.serviceType || !formData.datePreference || !formData.timePreference) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await addDoc(collection(db, 'pastoralRequests'), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // Send admin notification
      await addDoc(collection(db, 'adminNotifications'), {
        type: 'pastoral',
        label: `${formData.name} - ${serviceTypes.find(s => s.id === formData.serviceType)?.title || 'Pastoral Request'}`,
        name: formData.name,
        serviceType: formData.serviceType,
        datePreference: formData.datePreference,
        timePreference: formData.timePreference,
        email: formData.email,
        phone: formData.phone || null,
        isRead: false,
        createdAt: serverTimestamp(),
      });

      setSubmitStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        serviceType: '', 
        datePreference: '', 
        timePreference: '', 
        message: '' 
      });
    } catch (error) {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <FluidBackground />
      <CustomCursor />
      <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 md:px-8 lg:px-16">
        {/* Hero */}
<section className="mb-12 md:mb-16 lg:mb-20 py-8 md:py-12">
          <div className="grid lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-6 text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-white via-[#4fb7b3] to-slate-300 bg-clip-text text-transparent"
              >
                Pastoral Care
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg max-w-xl text-slate-300 leading-relaxed"
              >
                Request pastoral services for life's sacred moments – dedications, blessings, memorials.
              </motion.p>
            </div>
            <div className="lg:col-span-6 hidden lg:block"></div>
          </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Services */}
          <section className="lg:col-span-5 order-2 lg:order-1 mb-8 lg:mb-0">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-white text-center lg:text-left">
              Request for
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {serviceTypes.map((service, index) => {
                const isSelected = formData.serviceType === service.id;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 backdrop-blur-sm ${
                      isSelected 
                        ? 'border-[#4fb7b3] bg-[#4fb7b3]/10 shadow-[#4fb7b3]/20' 
                        : 'border-white/20 bg-white/5 hover:border-[#4fb7b3]/50'
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold mb-2 shadow-md ${service.color}`}>
                      {service.icon}
                    </div>
                    <h4 className={`font-bold text-sm mb-1 ${isSelected ? 'text-[#4fb7b3]' : 'text-white'}`}>
                      {service.title}
                    </h4>
                    <p className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {service.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center col-span-full max-w-md mx-auto">
              * If you have multiple requests, please submit one at a time for proper scheduling.
            </p>
          </section>

          {/* Form */}
          <section id="request-form" className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-white via-[#4fb7b3] to-white bg-clip-text text-transparent">
                  Submit Request
                </h3>
                <p className="text-sm text-slate-400 mb-6 text-center max-w-md mx-auto">
                  Submit your request and our Pastoral Care team will contact you to schedule and confirm details.
                </p>
                {selectedService && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4fb7b3]/20 border border-[#4fb7b3]/30 px-3 py-1 rounded-lg text-xs font-semibold text-[#4fb7b3]">
                    <span className={`w-4 h-4 rounded bg-gradient-to-r ${selectedService.color} flex items-center justify-center font-bold`}>
                      {selectedService.icon}
                    </span>
                    {selectedService.title}
                  </div>
                )}
              </div>

              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 text-center text-sm"
                >
                  ✅ Request sent successfully!
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-400/50 text-red-100 text-center text-sm"
                >
                  ⚠️ Please try again.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-200 uppercase tracking-wide">Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-800/50 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-[#4fb7b3] focus:ring-2 transition-all text-sm"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-200 uppercase tracking-wide">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-800/50 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-[#4fb7b3] focus:ring-2 transition-all text-sm"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-slate-200 uppercase tracking-wide">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-slate-800/50 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-[#4fb7b3] focus:ring-2 transition-all text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-200 uppercase tracking-wide">Service *</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-800/50 border border-white/20 rounded-xl text-white focus:border-[#4fb7b3] focus:ring-2 transition-all text-sm appearance-none"
                      required
                    >
                      <option value="">Choose...</option>
                      {serviceTypes.map(service => (
                        <option key={service.id} value={service.id}>{service.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-200 uppercase tracking-wide">Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        name="datePreference"
                        type="date"
                        value={formData.datePreference}
                        onChange={handleChange}
                        className="w-full pl-10 h-12 pr-4 bg-slate-800/50 border border-white/20 rounded-xl text-white focus:border-[#4fb7b3] focus:ring-2 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-slate-200 uppercase tracking-wide">Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      name="timePreference"
                      type="time"
                      value={formData.timePreference}
                      onChange={handleChange}
                      className="w-full pl-10 h-12 pr-4 bg-slate-800/50 border border-white/20 rounded-xl text-white focus:border-[#4fb7b3] focus:ring-2 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-slate-200 uppercase tracking-wide">Notes</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-[#4fb7b3] focus:ring-2 transition-all text-sm resize-vertical"
                    placeholder="Additional details..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.serviceType || !formData.datePreference || !formData.timePreference}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 bg-gradient-to-r from-[#4fb7b3] to-blue-500 text-black font-bold rounded-xl uppercase tracking-wide shadow-xl hover:shadow-[#4fb7b3]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </motion.button>
              </form>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PastoralCare;

