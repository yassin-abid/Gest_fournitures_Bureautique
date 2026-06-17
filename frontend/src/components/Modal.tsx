/**
 * Modal Component
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeButton = true,
  size = 'md',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${sizeClasses[size]} w-11/12`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            {title && <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>}
            {closeButton && (
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer || onConfirm ? (
          <div className="border-t border-neutral-200 p-6 bg-neutral-50 flex items-center justify-end gap-3">
            {footer || (
              <>
                <Button variant="ghost" onClick={onClose} disabled={isConfirming}>
                  {cancelText}
                </Button>
                <Button variant="primary" onClick={handleConfirm} isLoading={isConfirming}>
                  {confirmText}
                </Button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
