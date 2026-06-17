/**
 * Dropdown Component
 */

import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect?: (value: string | number) => void;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, onSelect, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 min-w-48 z-50 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider ? (
                <div className="border-t border-neutral-200 my-1" />
              ) : (
                <button
                  onClick={() => {
                    onSelect?.(item.value);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm"
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.displayName = 'Dropdown';
