import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock } from 'lucide-react';

const EVENTS = [
  { id: 1, title: "Youth Summer Camp", date: "July 15-18, 2026", time: "All Day", location: "Camp Hope, Rizal", description: "A 4-day retreat for teenagers to encounter God, build friendships, and grow in faith." },
  { id: 2, title: "Community Outreach", date: "April 20, 2026", time: "8:00 AM - 12:00 PM", location: "Navotas City Plaza", description: "Join us as we distribute food packs and pray for families in our local community." },
  { id: 3, title: "Worship Night", date: "May 5, 2026", time: "7:00 PM", location: "Main Sanctuary", description: "An evening dedicated entirely to extended worship, praise, and seeking God's presence." }
];

const Events: React.FC = () => {
  return (
    <section id="events" className="py-24 px-6 md:px-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Upcoming Events</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Mark your calendars and get involved.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EVENTS.map((evt, i) => (
            <motion.div 
              key={evt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col h-full"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{evt.title}</h3>
              <div className="space-y-3 text-slate-600 text-sm mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{evt.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{evt.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{evt.location}</span>
                </div>
              </div>
              <p className="text-slate-600 mb-8 flex-1 leading-relaxed">{evt.description}</p>
              <button className="w-full py-3 px-6 bg-white border border-slate-200 text-slate-900 font-semibold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
                Register Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
