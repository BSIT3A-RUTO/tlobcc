import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { EVENTS } from '../data';
import { getEvents, EventRecord } from '../services/contentService';
import { getImageUrl } from '../services/storageService';

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getEvents();
        if (mounted) {
          if (data.length > 0) {
            // Resolve image URLs for storage paths
            const resolvedEvents = await Promise.all(
              data.map(async (event) => ({
                ...event,
                image: event.image ? await getImageUrl(event.image) : undefined,
              }))
            );
            setEvents(resolvedEvents);
          } else {
            // Only use fallback if Firestore returns empty
            setEvents(EVENTS);
          }
        }
      } catch (error) {
        // On error, try fallback
        if (mounted) setEvents(EVENTS);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const displayEvents = events.length > 0 ? events : EVENTS;

  return (
    <div className="pt-28 md:pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Hero */}
        <section className="mb-15 md:mb-10 py-8 md:py-20 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="font-heading text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-white via-[#4fb7b3] to-slate-300 bg-clip-text text-transparent"
          >
            Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg max-w-xl mx-auto text-slate-300 leading-relaxed px-4"
          >
            Join our community gatherings, worship nights, and outreach events.
          </motion.p>
        </section>

        <div className="space-y-6">
          {displayEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 md:p-6 hover:border-[#4fb7b3]/60 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden"
            >
              {event.image ? (
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-60 lg:h-130 object-cover rounded-t-2xl group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-[240px] lg:h-[340px] bg-gradient-to-br from-slate-800 to-slate-700 rounded-t-2xl flex items-center justify-center">
                  <span className="text-slate-500 text-sm">No image</span>
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300">
                  <CalendarDays className="w-4 h-4" /> {event.date}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">{event.title}</h2>
                <p className="text-slate-300 leading-relaxed">{event.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-2 text-xs text-slate-400">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5" /> {event.time}
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                      <MapPin className="w-3.5 h-3.5" /> {event.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-1 justify-end">
                    {event.postLink && (
                      <a href={event.postLink} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-wide text-[#4fb7b3] border border-[#4fb7b3]/40 px-3 py-1 rounded-full hover:bg-[#4fb7b3] hover:text-black transition-all">Post</a>
                    )}
                    {event.registerLink && (
                      <a href={event.registerLink} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-wide text-emerald-400 border border-emerald-400/40 px-3 py-1 rounded-full hover:bg-emerald-400 hover:text-black transition-all">Register</a>
                    )}
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

