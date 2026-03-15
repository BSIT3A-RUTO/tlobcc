import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Clock } from 'lucide-react';

const SERMONS = [
  { id: 1, title: "The Power of Grace", series: "Foundations", speaker: "Pastor John Doe", date: "Oct 15, 2025", duration: "45 mins", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Walking in Faith", series: "Foundations", speaker: "Pastor Sarah Smith", date: "Oct 8, 2025", duration: "42 mins", image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Community Matters", series: "Better Together", speaker: "Pastor John Doe", date: "Oct 1, 2025", duration: "38 mins", image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=600&auto=format&fit=crop" }
];

const Sermons: React.FC = () => {
  return (
    <section id="sermons" className="py-24 px-6 md:px-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Sermons</h2>
            <p className="text-lg text-slate-600 max-w-2xl">Catch up on recent messages and series.</p>
          </div>
          <button className="mt-6 md:mt-0 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 transition-colors">
            View All Sermons &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERMONS.map((sermon, i) => (
            <motion.div 
              key={sermon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group cursor-pointer hover:shadow-md transition-all"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={sermon.image} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                    <Play className="w-6 h-6 text-blue-600 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {sermon.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sermon.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{sermon.title}</h3>
                <p className="text-sm text-blue-600 font-medium mb-4">{sermon.series}</p>
                <p className="text-sm font-medium text-slate-700">{sermon.speaker}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sermons;
