/**
 * Loader Components
 */

import React from 'react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false, className = '', ...props }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  const spinner = (
    <div className={`${sizeClass} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin ${className}`} {...props} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

Loader.displayName = 'Loader';

/**
 * Loading Skeleton Component
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  rows?: number;
  variant?: 'text' | 'circle' | 'rect';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  rows = 3,
  variant = 'text',
  className = '',
  ...props
}) => {
  const baseClass = 'bg-neutral-200 animate-pulse rounded';

  if (variant === 'circle') {
    return (
      <div className={`w-12 h-12 ${baseClass} rounded-full ${className}`} {...props} />
    );
  }

  if (variant === 'rect') {
    return (
      <div className={`w-full h-32 ${baseClass} ${className}`} {...props} />
    );
  }

  return (
    <div className="space-y-3" {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          {Array.from({ length: rows }).map((_, j) => (
            <div
              key={j}
              className={`${baseClass} h-4 ${j === rows - 1 ? 'w-5/6' : 'w-full'} ${className}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';
