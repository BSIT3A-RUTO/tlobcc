import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleFormSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export const CollapsibleFormSection: React.FC<CollapsibleFormSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-[#4fb7b3]">{icon}</span>}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-white/10 px-4 py-4 space-y-4 bg-slate-900/30">
          {children}
        </div>
      )}
    </div>
  );
};
