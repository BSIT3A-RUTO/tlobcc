import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const STORIES = [
  { id: 1, quote: "Finding TLOBCC changed my life. The community here is so welcoming, and the teachings have helped me grow deeper in my faith than ever before.", author: "Maria Santos", role: "Member since 2023" },
  { id: 2, quote: "The youth ministry gave my teenagers a safe place to ask questions and find their identity in Christ. We are so grateful for the leaders.", author: "David & Anna Reyes", role: "Parents" },
  { id: 3, quote: "I came broken and looking for answers. Through the Life Groups, I found a family that prayed for me and stood by me through my hardest seasons.", author: "Joshua Lim", role: "Life Group Leader" }
];

const Testimonials: React.FC = () => {
  return (
    <section id="stories" className="py-24 px-6 md:px-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Stories of Grace</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Hear how God is moving in the lives of our church family.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story, i) => (
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
      </div>
    </section>
  );
};

export default Testimonials;
