import React, { useEffect, useRef, useState } from 'react';

interface PopoverProps {
  trigger: (props: { onClick: () => void; open: boolean }) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
  estimatedPanelHeight?: number;
  estimatedPanelWidth?: number;
}

// Generic trigger-button + floating panel, flips to open upward when there
// isn't enough room below, and to open right-aligned when there isn't enough
// room to the right (same behavior as Select / DatePicker, plus horizontal flip).
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  className,
  panelClassName,
  estimatedPanelHeight = 320,
  estimatedPanelWidth = 288,
}) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
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
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < estimatedPanelHeight && rect.top > spaceBelow);
      setAlignRight(window.innerWidth - rect.left < estimatedPanelWidth);
    }
    setOpen((o) => !o);
  };

  return (
    <div className={`relative ${className ?? ''}`} ref={containerRef}>
      {trigger({ onClick: handleToggle, open })}
      {open && (
        <div
          className={`absolute z-30 rounded-xl border border-slate-200 bg-white shadow-lg ${
            openUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${alignRight ? 'right-0' : 'left-0'} ${panelClassName ?? ''}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
