import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Employee } from '../../types/employee';
import { ArrowRight, Eye, Calendar, Mail } from 'lucide-react';

interface RecentEmployeesTableProps {
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  onViewAll: () => void;
}

export const RecentEmployeesTable: React.FC<RecentEmployeesTableProps> = ({
  employees,
  onViewEmployee,
  onViewAll,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">
            Recent Employees
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest additions to the organization
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No employees found.</p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {employees.map((emp) => {
            const initials = `${emp.first_name[0] || ''}${emp.last_name[0] || ''}`.toUpperCase();
            return (
              <div
                key={emp.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {emp.first_name} {emp.last_name}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {emp.employee_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="truncate">{emp.job_title}</span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {emp.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden md:flex flex-col items-end">
                    <Badge variant="indigo" size="sm">
                      {emp.department}
                    </Badge>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {emp.joining_date}
                    </span>
                  </div>

                  <Badge
                    variant={emp.status === 'ACTIVE' ? 'success' : 'neutral'}
                    size="sm"
                  >
                    {emp.status}
                  </Badge>

                  <button
                    onClick={() => onViewEmployee(emp)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View details"
                    aria-label={`View details for ${emp.first_name} ${emp.last_name}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
