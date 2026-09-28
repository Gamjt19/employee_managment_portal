import React from 'react';
import { Card } from '../common/Card';
import { UserCheck, UserX, ShieldCheck, Zap } from 'lucide-react';

interface StatusBreakdownProps {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
}

export const StatusBreakdown: React.FC<StatusBreakdownProps> = ({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
}) => {
  const activeRate = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;
  const inactiveRate = totalEmployees > 0 ? 100 - activeRate : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">
            Workforce Status & Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active retention and employment posture
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Optimal
        </span>
      </div>

      {/* Progress ratio bar */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${activeRate}%` }}
            title={`Active: ${activeRate}%`}
          />
          <div
            className="h-full bg-slate-300 dark:bg-slate-700 transition-all duration-500"
            style={{ width: `${inactiveRate}%` }}
            title={`Inactive: ${inactiveRate}%`}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Active: {activeRate}%</span>
          <span>Inactive: {inactiveRate}%</span>
        </div>
      </div>

      {/* Detail Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <UserCheck className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Active Staff</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeEmployees}
          </div>
          <span className="text-[11px] text-slate-400">Currently deployed</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <UserX className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Inactive Staff</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {inactiveEmployees}
          </div>
          <span className="text-[11px] text-slate-400">On leave / departed</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3">
        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
          Employee directory is up-to-date. Regular records review ensures accurate reporting for payroll and department planning.
        </p>
      </div>
    </Card>
  );
};
