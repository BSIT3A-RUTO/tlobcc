import React from 'react';
import { motion } from 'framer-motion';

const TEAM = [
  { id: 1, name: "Pastor John Doe", role: "Senior Pastor", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Pastor Sarah Smith", role: "Associate Pastor", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Mark Johnson", role: "Youth Director", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Emily Davis", role: "Worship Leader", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" }
];

const Team: React.FC = () => {
  return (
    <section id="team" className="py-24 px-6 md:px-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Leadership</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Meet the dedicated team serving our church family.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {TEAM.map((member, i) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-sm border-4 border-white">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-medium text-sm">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
