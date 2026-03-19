import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'visit' | 'group' | 'donate' | null;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, type }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const getTitle = () => {
    switch (type) {
      case 'visit': return 'Plan a Visit';
      case 'group': return 'Join a Life Group';
      case 'donate': return 'Support Our Ministry';
      default: return 'Connect With Us';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'visit': return 'Let us know you\'re coming so we can welcome you properly!';
      case 'group': return 'Find a community to grow with. Tell us a bit about yourself.';
      case 'donate': return 'Thank you for your generosity. Please leave your details.';
      default: return 'We\'d love to hear from you.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSave = {
        name: formData.name,
        email: formData.email,
        type: type || 'visit',
        createdAt: new Date(),
      };
      
      if (formData.phone) (dataToSave as any).phone = formData.phone;
      if (formData.message) (dataToSave as any).message = formData.message;

      await addDoc(collection(db, 'connectRequests'), dataToSave);
      await addDoc(collection(db, 'adminNotifications'), {
        type: 'connect',
        category: type || 'visit',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        createdAt: new Date(),
        isRead: false,
        label: getTitle(),
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
        onClose();
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, 'connectRequests');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#1a1b3b] border border-white/10 p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4fb7b3] to-[#637ab9]" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4fb7b3]/20 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-[#a8fbd3] mb-6" />
                </motion.div>
                <h3 className="text-3xl font-heading font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300">Thank you for reaching out. Our team will get back to you shortly.</p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">{getTitle()}</h3>
                  <p className="text-gray-400 text-sm">{getSubtitle()}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#4fb7b3] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#4fb7b3] transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#4fb7b3] transition-colors"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Additional Details</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#4fb7b3] transition-colors resize-none"
                      placeholder={type === 'visit' ? 'Any questions before you visit?' : 'Tell us a bit about yourself...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-white text-black font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-[#a8fbd3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Details</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectModal;
