/**
 * Breadcrumb Component
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} className="text-neutral-400" />}
          {item.href ? (
            <button
              onClick={() => onNavigate?.(item.href!)}
              className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-neutral-700 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
