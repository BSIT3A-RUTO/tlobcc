import React from 'react';

const LiveStreamBanner: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white px-4 py-2.5 text-sm font-medium flex flex-col sm:flex-row justify-center items-center gap-3 w-full z-50">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <span className="tracking-wide">WE ARE LIVE! JOIN OUR SUNDAY WORSHIP SERVICE NOW.</span>
      </div>
      <button className="bg-white text-blue-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
        WATCH
      </button>
    </div>
  );
};

export default LiveStreamBanner;
