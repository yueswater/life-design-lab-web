import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

// Custom single-select dropdown, flips to open upward when there isn't
// enough room below (e.g. near the bottom of the viewport).
export function Select<T extends string>({ value, options, onChange, className }: SelectProps<T>) {
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
      const estimatedMenuHeight = Math.min(options.length * 38 + 16, 280);
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < estimatedMenuHeight && rect.top > spaceBelow);
    }
    setOpen((o) => !o);
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className ?? ''}`} ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className="flex h-[38px] w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
      >
        <span className="truncate">{selected?.label ?? ''}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-20 w-full min-w-max overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg ${
            openUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm cursor-pointer transition-colors ${
                value === opt.value ? 'bg-[#FBD634]/20' : 'hover:bg-slate-50'
              }`}
            >
              <span className={`flex-1 truncate ${value === opt.value ? 'font-semibold text-[#023047]' : 'text-slate-700'}`}>
                {opt.label}
              </span>
              {value === opt.value && <Check className="h-3.5 w-3.5 shrink-0 text-[#023047]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
