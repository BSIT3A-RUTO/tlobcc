import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { getTestimonials, TestimonyRecord } from '../services/contentService';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTestimonials();
        if (data.length > 0) {
          setTestimonials(data);
        }
      } catch {
        // fallback to empty or hardcoded if needed
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="py-24 text-center">Loading stories...</div>;
  }

  return (
    <section id="stories" className="py-24 px-6 md:px-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Stories of Grace</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Hear how God is moving in the lives of our church family.</p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No testimonials yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((story, i) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative flex flex-col"
              >
                <Quote className="w-10 h-10 text-blue-200 mb-6" />
                <p className="text-lg leading-relaxed mb-8 text-slate-700 italic flex-1">"{story.quote}"</p>
                <div className="mt-auto">
                  <h4 className="font-bold text-slate-900">{story.author}</h4>
                  <p className="text-blue-600 text-sm font-medium mt-1">{story.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
