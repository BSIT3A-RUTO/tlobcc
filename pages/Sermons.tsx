import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, User } from 'lucide-react';
import { SERMONS } from '../data';
import { getSermons, SermonRecord } from '../services/contentService';

const Sermons: React.FC = () => {
  const [sermons, setSermons] = useState<SermonRecord[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getSermons();
        if (mounted && data.length > 0) setSermons(data);
      } catch {
        if (mounted) setSermons(SERMONS.map((s) => ({ ...s, id: String(s.id) })));
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const displaySermons = sermons.length > 0 ? sermons : SERMONS.map((s) => ({ ...s, id: String(s.id) }));

  return (
    <div className="pt-32 pb-20">
      <section className="relative z-10 py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg mb-4">
            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4b4b] to-[#ff8f8f]">Stream</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">For the latest live sermon, visit our Facebook page and join us live.</p>
          <div className="flex items-center justify-center">
            <a
              href="https://www.facebook.com/tlobccmain"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white text-black px-6 py-3 font-bold uppercase tracking-[0.12em] text-sm transition hover:bg-slate-200"
            >
              Visit Facebook for Live Sermons
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg">
              Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">Messages</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {displaySermons.map((sermon) => (
              <a
                key={sermon.id}
                href={`https://www.youtube.com/watch?v=${sermon.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <motion.div whileHover={{ y: -10 }} className="group relative bg-white/5 border border-white/10 overflow-hidden cursor-pointer h-full">
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img src={sermon.image} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-mono text-[#4fb7b3] border border-[#4fb7b3]/30 px-2 py-1 rounded-full">{sermon.series}</span>
                      <span className="text-xs text-gray-400 font-mono">{sermon.date}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold mb-2">{sermon.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <User className="w-4 h-4" /> {sermon.speaker}
                    </div>
                  </div>
                </motion.div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
