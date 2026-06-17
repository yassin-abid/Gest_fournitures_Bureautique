/**
 * StatCard Component for Dashboard
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  primary: 'bg-primary-50 border-primary-200',
  secondary: 'bg-secondary-50 border-secondary-200',
  success: 'bg-green-50 border-green-200',
  warning: 'bg-amber-50 border-amber-200',
  danger: 'bg-red-50 border-red-200',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  color = 'primary',
}) => {
  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="text-green-600" size={16} />
              ) : (
                <TrendingDown className="text-red-600" size={16} />
              )}
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-neutral-400">{icon}</div>}
      </div>
    </div>
  );
};

StatCard.displayName = 'StatCard';
