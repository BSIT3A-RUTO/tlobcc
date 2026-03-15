import React from 'react';

interface Props {
  text: string;
  as?: any;
  className?: string;
}

const GlitchText: React.FC<Props> = ({ text, as: Component = 'div', className = '' }) => {
  return (
    <Component className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-[2px] -z-10 text-[#4fb7b3] opacity-70 animate-pulse" style={{ animationDuration: '0.2s' }}>{text}</span>
      <span className="absolute top-0 -left-[2px] -z-10 text-[#a8fbd3] opacity-70 animate-pulse" style={{ animationDuration: '0.3s', animationDelay: '0.1s' }}>{text}</span>
    </Component>
  );
};

export default GlitchText;
