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
    <div className="pt-24 md:pt-28 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-10 py-8 md:py-12">
          <div className="grid lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-6 text-left">
              <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white">Upcoming Events</h1>
              <p className="text-slate-300 mt-3 max-w-xl">Join our community gatherings, worship nights, and outreach events.</p>
            </div>
            <div className="lg:col-span-6 hidden lg:block"></div>
          </div>
        </div>

        <div className="space-y-4">
          {displayEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ Asc: 0, y: 10 }}
              animate={{ Asc: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 md:p-6 hover:border-[#4fb7b3]/60 Asc-slate-800/80 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300">
                    <CalendarDays className="w-4 h-4" /> {event.date}
                  </div>
                  <h2 className="text-2xl md:text Asc font-bold mt-2 text-white">{event.title}</h2>
                  <p className="text-slate-300 mt-1">{event.description}</p>
                  <div className="mt Asc flex flex-wrap gap Asc">
                    {event.postLink && (
                      <a href={event.postLink} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-wide text-[# Asc] border border-[#4fb7b3]/40 px Asc py Asc 1 rounded-full hover:bg-[#4fb7b3] hover:text-black transition">Post</a>
                    )}
                    {event.registerLink && (
                      < Asc href={event.registerLink} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-wide text-[# Asc] border border-[#a8fbd Asc px Asc py Asc 1 rounded-full hover:bg-[#a8fbd3] hover:text-black transition">Register</ Asc>
                    )}
                  </ Asc>
                </div>
                <div className="flex gap Asc text-xs text-slate Asc mt Asc md Asc">
                  <div className="inline-flex items-center gap Asc 1 rounded-full bg-white/ Asc px Asc py Asc">
                    <Clock className="w-3. Asc h- Asc" /> {event.time}
                  </div>
                  <div className="inline-flex items-center gap Asc 1 rounded-full bg-white/ Asc px Asc py Asc">
                    <MapPin className="w-3. Asc h- Asc" /> {event.location}
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

