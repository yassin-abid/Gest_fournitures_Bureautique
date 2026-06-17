/**
 * Alert Component
 */

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  onClose?: () => void;
  closable?: boolean;
}

const alertStyles = {
  success: {
    container: 'bg-green-50 border border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    text: 'text-green-800',
    iconComponent: CheckCircle,
  },
  error: {
    container: 'bg-red-50 border border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    text: 'text-red-800',
    iconComponent: AlertCircle,
  },
  warning: {
    container: 'bg-amber-50 border border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-900',
    text: 'text-amber-800',
    iconComponent: AlertTriangle,
  },
  info: {
    container: 'bg-blue-50 border border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    text: 'text-blue-800',
    iconComponent: Info,
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  closable = true,
  className = '',
  ...props
}) => {
  const styles = alertStyles[type];
  const IconComponent = styles.iconComponent;

  return (
    <div className={`rounded-lg p-4 ${styles.container} ${className}`} {...props}>
      <div className="flex items-start gap-3">
        <IconComponent className={`${styles.icon} flex-shrink-0 mt-0.5`} size={20} />
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${styles.title}`}>{title}</h3>}
          {children && <p className={`text-sm ${styles.text} ${title ? 'mt-1' : ''}`}>{children}</p>}
        </div>
        {closable && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-75 transition-opacity`}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

Alert.displayName = 'Alert';
