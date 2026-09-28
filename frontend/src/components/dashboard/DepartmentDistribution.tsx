import React from 'react';
import { Card } from '../common/Card';
import { DepartmentStat } from '../../types/employee';

interface DepartmentDistributionProps {
  departments: DepartmentStat[];
  totalEmployees: number;
}

export const DepartmentDistribution: React.FC<DepartmentDistributionProps> = ({
  departments,
  totalEmployees,
}) => {
  const colors = [
    'bg-indigo-600',
    'bg-violet-500',
    'bg-sky-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-teal-500',
    'bg-fuchsia-500',
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">
            Department Headcount
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Distribution across all organizational units
          </p>
        </div>
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
          {departments.length} Departments
        </span>
      </div>

      <div className="space-y-4">
        {departments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No department data available.</p>
        ) : (
          departments.map((dept, index) => {
            const percentage = totalEmployees > 0 ? Math.round((dept.count / totalEmployees) * 100) : 0;
            const colorClass = colors[index % colors.length];

            return (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {dept.department}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">
                      {dept.count} {dept.count === 1 ? 'employee' : 'employees'} ({dept.activeCount} active)
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 min-w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
