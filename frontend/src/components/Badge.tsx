/**
 * Badge Component
 */

import React from 'react';
import { X } from 'lucide-react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  closable?: boolean;
  onClose?: () => void;
}

const badgeStyles = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-error/10 text-error',
  info: 'bg-blue-100 text-blue-800',
};

const badgeSizes = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  closable = false,
  onClose,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${badgeStyles[variant]} ${badgeSizes[size]} ${className}`}
      {...props}
    >
      {children}
      {closable && (
        <button onClick={onClose} className="hover:opacity-75 transition-opacity">
          <X size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
        </button>
      )}
    </div>
  );
};

Badge.displayName = 'Badge';

/**
 * Status Badge Component
 */

type StatusBadgeVariant = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'error';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusBadgeVariant;
}

const statusBadgeStyles = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-neutral-100 text-neutral-800',
  pending: 'bg-amber-100 text-amber-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  error: 'bg-red-100 text-red-800',
};

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  error: 'Error',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', ...props }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadgeStyles[status]} ${className}`}
      {...props}
    >
      {statusLabels[status]}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
