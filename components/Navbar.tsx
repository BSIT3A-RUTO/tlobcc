import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onConnectClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onConnectClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Sermons', path: '/sermons' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 bg-transparent">
        <Link to="/" className="flex items-center gap-3 z-50">
          <img src="/TLOB%20LOGO%20UPDATED.png" alt="TLOBCC Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full bg-white/10" />
          <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white">TLOBCC</div>
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
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="text-xs font-bold uppercase tracking-wider text-white border border-white/20 px-3 py-2 rounded hover:bg-white hover:text-black transition"
          >
            Admin
          </Link>
          <button 
            onClick={onConnectClick}
            className="border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
            data-hover="true"
          >
            Join Us
          </button>
        </div>

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
