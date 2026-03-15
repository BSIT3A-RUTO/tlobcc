import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
           <div className="flex items-center gap-4 mb-4">
             <img src="/TLOB%20LOGO%20UPDATED.png" alt="TLOBCC Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full bg-white/10" />
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter text-white">TLOBCC</div>
           </div>
           <div className="flex gap-2 text-xs font-mono text-gray-400">
             <span>The Lord Our Banner Christian Church</span>
           </div>
        </div>
        
        <div className="flex gap-6 md:gap-8 flex-wrap">
          <a href="https://www.facebook.com/tlobccmain" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
            Facebook
          </a>
          <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
            YouTube
          </a>
          <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
