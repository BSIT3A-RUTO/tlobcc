import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onConnectClick: () => void;
  bannerText?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onConnectClick, bannerText }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Pastoral Care', path: '/pastoral-care' },
    { name: 'Events', path: '/events' },
    { name: 'Sermons', path: '/sermons' },
  ];

  return (
    <>
      {bannerText && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-white text-black text-center py-1 px-2 text-sm md:text-base font-black tracking-[0.15em] uppercase shadow border-b border-slate-200">
          <motion.div
            animate={{ x: [-6, 6, -6] }}
            transition={{ repeat: Infinity, repeatType: 'loop', duration: 5, ease: 'easeInOut' }}
            className="inline-block"
          >
            <span className="inline-block max-w-full break-words text-base md:text-base font-extrabold tracking-tight leading-tight">
              {bannerText}
            </span>
          </motion.div>
        </div>
      )}
      <nav aria-label="Main navigation" className={`fixed left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 bg-transparent ${bannerText ? 'top-10 md:top-7' : 'top-0'}`}>
        <Link to="/" className="flex items-center gap-3 z-50">
          <img src="/TLOB%20LOGO%20UPDATED.png" alt="TLOBCC Logo" className="w-10 h- md:w-12 md:h-12 object-contain rounded-full bg-white/10" />
          <div className="font-heading text-xl md:text-xl font-bold tracking-tighter text-white">TLOBCC</div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {navLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`transition-colors text-white cursor-pointer bg-transparent border-none ${location.pathname === item.path ? 'text-[#4fb7b3]' : 'hover:text-[#a8fbd3]'}`}
              data-hover="true"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button 
          onClick={onConnectClick}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          Join Us
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#31326f]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-4xl font-heading font-bold transition-colors uppercase bg-transparent border-none ${location.pathname === item.path ? 'text-[#4fb7b3]' : 'text-white hover:text-[#a8fbd3]'}`}
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onConnectClick();
              }}
              className="mt-8 border border-white px-10 py-4 text-sm font-bold tracking-widest uppercase bg-white text-black"
            >
              Join Us
            </button>
            
            <div className="absolute bottom-10 flex gap-6">
               <a href="https://www.facebook.com/tlobccmain" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">Facebook</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
