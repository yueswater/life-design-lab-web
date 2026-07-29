import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarDays, X } from 'lucide-react';
import { toDateKey } from '../../lib/appointment-slots';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Custom date picker (react-calendar in a popover), flips to open upward
// when there isn't enough room below.
export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = '選擇日期', className }) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const estimatedMenuHeight = 360;
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < estimatedMenuHeight && rect.top > spaceBelow);
    }
    setOpen((o) => !o);
  };

  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;

  return (
    <div className={`relative ${className ?? ''}`} ref={containerRef}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-expanded={open}
        className="flex h-[38px] w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
      >
        <span className={`truncate ${value ? '' : 'text-slate-400'}`}>{value || placeholder}</span>
        <span className="flex shrink-0 items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              aria-label="清除日期"
              className="cursor-pointer text-slate-400 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <CalendarDays className="h-4 w-4 text-slate-400" />
        </span>
      </div>

      {open && (
        <div
          className={`absolute z-20 w-[300px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg ${
            openUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          <Calendar
            className="ldl-calendar"
            onChange={(date) => {
              onChange(toDateKey(date as Date));
              setOpen(false);
            }}
            value={selectedDate}
            locale="zh-TW"
            minDetail="month"
            next2Label={null}
            prev2Label={null}
            formatDay={(_, date) => String(date.getDate())}
            formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'narrow' })}
          />
        </div>
      )}
    </div>
  );
};
