import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (val: string) => void;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#131d35] border rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'border-[#3b82f6]' : 'border-[#1e293b] hover:border-[#334155]'} ${className}`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#3b82f6]' : 'text-[#64748b]'}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <ul className="max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <li 
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`py-2.5 px-3.5 text-sm cursor-pointer transition-colors ${opt.value === value ? 'bg-[#1e3a8a]/40 text-[#3b82f6] font-bold' : 'text-[#f1f5f9] hover:bg-[#1e293b]'}`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
