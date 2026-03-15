import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, PlayCircle, Clock, MapPin, Ticket, Zap, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradientText from '../components/GlitchText';
import { SERMONS, EVENTS } from '../data';
import ConnectModal from '../components/ConnectModal';
import PrayerModal from '../components/PrayerModal';

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectModalType, setConnectModalType] = useState<'visit' | 'group' | 'donate' | null>(null);
  const [prayerModalOpen, setPrayerModalOpen] = useState(false);

  const handleConnectClick = (type: 'visit' | 'group' | 'donate') => {
    setConnectModalType(type);
    setConnectModalOpen(true);
  };

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <header className="relative h-[90svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-base font-mono text-[#a8fbd3] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <span>Navotas</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>Sunday 9AM</span>
          </motion.div>

          <div className="relative w-full flex justify-center items-center mt-6 md:mt-10 mb-2 md:mb-4">
            <h1 
              data-text="TLOBCC"
              className="relative inline-block w-fit font-heading text-[15vw] md:text-[14vw] leading-[0.9] font-black tracking-tighter text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 animate-gradient z-10 before:content-[attr(data-text)] before:absolute before:left-0 before:top-0 before:-z-10 before:text-shadow-3d before:text-stroke-2"
            >
              TLOBCC
            </h1>
            <motion.div 
               className="absolute -z-20 w-[50vw] h-[30vw] bg-white/5 blur-[40px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 4, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-2 md:mt-4 mb-3 md:mb-4"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-2xl font-light max-w-xl mx-auto text-white/90 leading-relaxed drop-shadow-lg px-4"
          >
            Loving God. Reaching People. Making Disciples.
          </motion.p>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-0 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-black shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    THE LORD OUR BANNER <span className="text-black text-2xl md:text-4xl">●</span> 
                    CHRISTIAN CHURCH <span className="text-black text-2xl md:text-4xl">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* LATEST SERMONS */}
      <section className="relative z-10 py-20 md:py-32 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16">
            <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg">
              Latest <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">Messages</span>
            </h2>
            <Link to="/sermons" className="mt-6 md:mt-0 text-sm font-bold tracking-widest uppercase hover:text-[#a8fbd3] transition-colors flex items-center gap-2">
              View All Sermons <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {SERMONS.slice(0, 3).map((sermon) => (
              <Link to="/sermons" key={sermon.id}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="group relative bg-white/5 border border-white/10 overflow-hidden cursor-pointer"
                  data-hover="true"
                >
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
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg mb-4">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#637ab9] to-[#4fb7b3]">Events</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Join us as we gather, grow, and go out into our community.</p>
          </div>

          <div className="space-y-4">
            {EVENTS.map((event) => (
              <motion.div 
                key={event.id}
                whileHover={{ x: 10 }}
                className="flex flex-col md:flex-row bg-black/40 border border-white/10 hover:border-[#4fb7b3]/50 transition-colors group"
              >
                <div className="md:w-48 bg-white/5 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 text-center">
                  <span className="text-[#a8fbd3] font-bold text-xl md:text-2xl tracking-wider">{event.date.split(' ')[0]}</span>
                  <span className="text-3xl md:text-4xl font-black font-heading">{event.date.split(' ')[1]}</span>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold font-heading mb-2 group-hover:text-[#a8fbd3] transition-colors">{event.title}</h3>
                  <p className="text-gray-400 mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-300">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#4fb7b3]" /> {event.time}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#4fb7b3]" /> {event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT SECTION */}
      <section className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-20 text-white">
               CONNECT
             </h2>
             <p className="text-[#a8fbd3] font-mono uppercase tracking-widest -mt-3 md:-mt-8 relative z-10 text-sm md:text-base">
               Get involved today
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sunday Service', price: 'Free', color: 'white', accent: 'bg-white/5', features: ['9:00 AM Main Service', 'Kids Church Available', 'Worship & Word', 'Fellowship'], buttonText: 'Plan a Visit', type: 'visit' as const },
              { name: 'Life Groups', price: 'Join', color: 'teal', accent: 'bg-[#4fb7b3]/10 border-[#4fb7b3]/50', features: ['Weekly Meetings', 'Bible Study', 'Prayer Support', 'Community Building'], buttonText: 'Sign Up', type: 'group' as const },
              { name: 'Give', price: 'Donate', color: 'periwinkle', accent: 'bg-[#637ab9]/10 border-[#637ab9]/50', features: ['Tithes & Offerings', 'Missions Support', 'Building Fund', 'Secure Online Giving'], buttonText: 'Donate Now', type: 'donate' as const },
            ].map((ticket, i) => {
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -20 }}
                  className={`relative p-8 md:p-10 border border-white/10 backdrop-blur-md flex flex-col min-h-[450px] md:min-h-[550px] transition-colors duration-300 ${ticket.accent} will-change-transform`}
                  data-hover="true"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-white">{ticket.name}</h3>
                    <div className={`text-5xl md:text-6xl font-bold mb-8 md:mb-10 tracking-tighter ${ticket.color === 'white' ? 'text-white' : ticket.color === 'teal' ? 'text-[#4fb7b3]' : 'text-[#637ab9]'}`}>
                      {ticket.price}
                    </div>
                    <ul className="space-y-4 md:space-y-6 text-sm text-gray-200">
                      <li className="flex items-center gap-3"><Ticket className="w-5 h-5 text-gray-400" /> {ticket.features[0]}</li>
                      <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-400" /> {ticket.features[1]}</li>
                      <li className="flex items-center gap-3 text-white"><Zap className={`w-5 h-5 text-[#a8fbd3]`} /> {ticket.features[2]}</li>
                      <li className="flex items-center gap-3 text-white"><Globe className={`w-5 h-5 text-[#4fb7b3]`} /> {ticket.features[3]}</li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handleConnectClick(ticket.type)}
                    className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border border-white/20 transition-all duration-300 mt-8 group overflow-hidden relative text-center block text-white cursor-pointer hover:bg-white hover:text-black"
                  >
                    <span className="relative z-10">
                      {ticket.buttonText}
                    </span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRAYER BANNER */}
      <section className="relative z-10 py-16 md:py-24 bg-gradient-to-b from-transparent to-[#1a1b3b]/80 border-t border-white/10 text-center px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <Heart className="w-12 h-12 text-[#4fb7b3] mb-6" />
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">How can we pray for you?</h2>
          <p className="text-gray-300 mb-8 text-lg">We believe in the power of prayer. Whatever you're going through, our pastoral team would love to stand with you in prayer.</p>
          <button 
            onClick={() => setPrayerModalOpen(true)}
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#a8fbd3] transition-colors flex items-center gap-2"
            data-hover="true"
          >
            Submit Prayer Request
          </button>
        </div>
      </section>

      <ConnectModal 
        isOpen={connectModalOpen} 
        onClose={() => setConnectModalOpen(false)} 
        type={connectModalType} 
      />
      <PrayerModal 
        isOpen={prayerModalOpen} 
        onClose={() => setPrayerModalOpen(false)} 
      />
    </div>
  );
};

export default Home;
