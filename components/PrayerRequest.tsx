import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';

const PrayerRequest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section id="prayer" className="py-24 px-6 md:px-12 bg-blue-50 border-t border-blue-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How can we pray for you?</h2>
          <p className="text-lg text-slate-600">Our pastoral team and prayer warriors would love to stand with you in prayer.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Name (Optional)</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email (Optional)</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="For follow-up"
              />
            </div>
          </div>
          <div className="mb-8">
            <label htmlFor="request" className="block text-sm font-semibold text-slate-700 mb-2">Prayer Request *</label>
            <textarea 
              id="request" 
              required
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Share your prayer request here..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status !== 'idle'}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
          >
            {status === 'idle' && <><Send className="w-5 h-5" /> Submit Request</>}
            {status === 'submitting' && 'Sending...'}
            {status === 'success' && 'Received! We are praying.'}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default PrayerRequest;
