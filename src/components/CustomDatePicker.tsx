import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  className?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse initial value or use today
  const initialDate = value ? new Date(value + 'T12:00:00') : new Date();
  
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const paddedMonth = (currentMonth + 1).toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    onChange(`${currentYear}-${paddedMonth}-${paddedDay}`);
    setIsOpen(false);
  };

  // Format display value
  let displayValue = 'DD/MM/AAAA';
  let isPlaceholder = true;
  if (value) {
    const parts = value.split('-');
    if (parts.length === 3) {
      const d = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parts[0];
      if (!isNaN(d) && !isNaN(m)) {
        displayValue = `${d} de ${monthNames[m]} ${y}`;
        isPlaceholder = false;
      }
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#131d35] border rounded-xl py-3 px-3.5 text-sm flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'border-[#3b82f6]' : 'border-[#1e293b] hover:border-[#334155]'} ${isPlaceholder ? 'text-gray-400' : 'text-[#f1f5f9]'} ${className}`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className={`w-4 h-4 ${isPlaceholder ? 'text-gray-500' : 'text-[#64748b]'}`} />
          <span>{displayValue}</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 sm:left-auto sm:w-72 top-full mt-2 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-[#1e293b] text-[#94a3b8]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-[#f1f5f9] text-sm">{monthNames[currentMonth]} {currentYear}</span>
            <button type="button" onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-[#1e293b] text-[#94a3b8]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {dayNames.map(d => (
              <div key={d} className="text-[10px] font-bold text-[#64748b]">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const paddedMonth = (currentMonth + 1).toString().padStart(2, '0');
              const paddedDay = day.toString().padStart(2, '0');
              const currentDateStr = `${currentYear}-${paddedMonth}-${paddedDay}`;
              const isSelected = value === currentDateStr;
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  className={`h-8 w-full rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-[#3b82f6] text-white shadow-blue-glow scale-105 z-10' 
                      : 'text-[#f1f5f9] hover:bg-[#1e293b]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
