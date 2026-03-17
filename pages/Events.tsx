import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { EVENTS } from '../data';
import { getEvents, EventRecord } from '../services/contentService';

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getEvents();
        if (mounted && data.length > 0) setEvents(data);
      } catch {
        if (mounted) setEvents(EVENTS);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const displayEvents = events.length > 0 ? events : EVENTS;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white">Upcoming Events</h1>
          <p className="text-slate-300 mt-3 max-w-2xl mx-auto">Join our community gatherings, worship nights, and outreach events.</p>
        </div>

        <div className="space-y-4">
          {displayEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 md:p-6 hover:border-[#4fb7b3]/60 hover:bg-slate-800/80 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300">
                    <CalendarDays className="w-4 h-4" /> {event.date}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mt-2 text-white">{event.title}</h2>
                  <p className="text-slate-300 mt-1">{event.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {event.postLink && (
                      <a href={event.postLink} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-wide text-[#4fb7b3] border border-[#4fb7b3]/40 px-3 py-1 rounded-full hover:bg-[#4fb7b3] hover:text-black transition">Post</a>
                    )}
                    {event.registerLink && (
                      <a href={event.registerLink} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-wide text-[#a8fbd3] border border-[#a8fbd3]/40 px-3 py-1 rounded-full hover:bg-[#a8fbd3] hover:text-black transition">Register</a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-slate-300 mt-2 md:mt-0">
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                    <Clock className="w-3.5 h-3.5" /> {event.time}
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
