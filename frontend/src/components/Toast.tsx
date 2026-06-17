/**
 * Toast/Notification Component
 */

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '@stores/uiStore';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'danger';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: <CheckCircle className="text-green-600" size={20} />,
  error: <AlertCircle className="text-red-600" size={20} />,
  warning: <AlertTriangle className="text-amber-600" size={20} />,
  info: <Info className="text-blue-600" size={20} />,
  danger: <AlertCircle className="text-red-700" size={20} />,
};

const toastStyles = {
  success: 'bg-green-50 border border-green-200',
  error: 'bg-red-50 border border-red-200',
  warning: 'bg-amber-50 border border-amber-200',
  info: 'bg-blue-50 border border-blue-200',
  danger: 'bg-red-100 border border-red-400',
};

const Toast: React.FC<ToastProps> = ({ id, type, message, title, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`rounded-lg p-4 shadow-lg ${toastStyles[type]} flex items-start gap-3 animate-slide-in`}>
      <div className="flex-shrink-0 mt-0.5">{toastIcons[type]}</div>
      <div className="flex-1">
        {title && <p className="font-semibold text-neutral-900">{title}</p>}
        <p className={`text-sm ${title ? 'mt-1' : ''} text-neutral-700`}>{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 */

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-3">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          title={notification.title}
          duration={notification.duration}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

ToastContainer.displayName = 'ToastContainer';
