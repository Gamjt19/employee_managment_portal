import React from 'react';
import { Card } from '../common/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose';
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  colorScheme,
  subtext,
  trend,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      badge: 'text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      badge: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      badge: 'text-amber-600 dark:text-amber-400',
    },
    sky: {
      bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      badge: 'text-sky-600 dark:text-sky-400',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      badge: 'text-rose-600 dark:text-rose-400',
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <Card hoverEffect className="p-6 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        </div>

        <div className={`w-12 h-12 rounded-2xl ${scheme.bg} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {subtext && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          {subtext}
        </p>
      )}
    </Card>
  );
};
