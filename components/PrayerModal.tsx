import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Heart } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrayerModal: React.FC<PrayerModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    isAnonymous: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        request: formData.request,
        isPrivate: formData.isAnonymous,
        createdAt: serverTimestamp(),
      };
      
      if (!formData.isAnonymous) {
        if (formData.name) (dataToSave as any).name = formData.name;
        if (formData.email) (dataToSave as any).email = formData.email;
      } else {
        (dataToSave as any).name = "Anonymous";
      }

      await addDoc(collection(db, 'prayerRequests'), dataToSave);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', request: '', isAnonymous: false });
        onClose();
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, 'prayerRequests');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
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
                <h3 className="text-3xl font-heading font-bold text-white mb-2">Prayer Request Sent</h3>
                <p className="text-gray-300">Our pastoral team will be praying for you.</p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-[#4fb7b3]" />
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white">Prayer Request</h3>
                    <p className="text-gray-400 text-sm">How can we pray for you today?</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#4fb7b3] bg-black/30 border-white/10"
                    />
                    <label htmlFor="isAnonymous" className="text-sm text-gray-300 cursor-pointer">Keep this request anonymous</label>
                  </div>

                  <AnimatePresence>
                    {!formData.isAnonymous && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div>
                          <label htmlFor="name" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Name (Optional)</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#4fb7b3] transition-colors"
                            placeholder="Your Name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Email (Optional)</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#4fb7b3] transition-colors"
                            placeholder="your@email.com"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label htmlFor="request" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Your Prayer Request</label>
                    <textarea
                      id="request"
                      name="request"
                      required
                      rows={4}
                      value={formData.request}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#4fb7b3] transition-colors resize-none"
                      placeholder="Share your prayer needs here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.request.trim()}
                    className="w-full mt-6 bg-white text-black font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-[#a8fbd3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Request</span>
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

export default PrayerModal;
