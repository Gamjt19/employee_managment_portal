import React from 'react';
import { Employee } from '../../types/employee';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import {
  Eye,
  Pencil,
  Trash2,
  Users,
  Mail,
  Phone,
  ArrowUpDown,
} from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onViewEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (emp: Employee) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  onResetFilters: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
}) => {
  const getDepartmentBadgeVariant = (dept: string) => {
    switch (dept.toLowerCase()) {
      case 'engineering':
        return 'indigo';
      case 'product':
        return 'purple';
      case 'design':
        return 'info';
      case 'marketing':
        return 'warning';
      case 'finance':
        return 'success';
      case 'human resources':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-75" />;
    }
    return (
      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          No employees found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
          No records match your active search or filter criteria. Try adjusting your query or resetting filters.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <th
                onClick={() => onSortChange('employee_id')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee ID</span>
                  {renderSortIndicator('employee_id')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('first_name')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  {renderSortIndicator('first_name')}
                </div>
              </th>
              <th className="py-3.5 px-4">Contact</th>
              <th
                onClick={() => onSortChange('department')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  {renderSortIndicator('department')}
                </div>
              </th>
              <th className="py-3.5 px-4">Job Title</th>
              <th
                onClick={() => onSortChange('status')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('joining_date')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Joining Date</span>
                  {renderSortIndicator('joining_date')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {employees.map((emp) => {
              const initials = `${emp.first_name[0] || ''}${emp.last_name[0] || ''}`.toUpperCase();

              return (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Employee ID */}
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      {emp.employee_id}
                    </span>
                  </td>

                  {/* Name with initials avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
                          {emp.first_name} {emp.last_name}
                        </span>
                        <span className="text-xs text-slate-400 block truncate sm:hidden">
                          {emp.job_title}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="py-3 px-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[170px]">{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{emp.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-4">
                    <Badge variant={getDepartmentBadgeVariant(emp.department) as any} size="sm">
                      {emp.department}
                    </Badge>
                  </td>

                  {/* Job Title */}
                  <td className="py-3 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {emp.job_title}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <Badge
                      variant={emp.status === 'ACTIVE' ? 'success' : 'neutral'}
                      size="sm"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-0.5 ${
                          emp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {emp.status}
                    </Badge>
                  </td>

                  {/* Joining Date */}
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {emp.joining_date}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Details */}
                      <button
                        onClick={() => onViewEmployee(emp)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                        title="View profile details"
                        aria-label={`View details for ${emp.first_name} ${emp.last_name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditEmployee(emp)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Edit employee"
                        aria-label={`Edit ${emp.first_name} ${emp.last_name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteEmployee(emp)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Delete employee"
                        aria-label={`Delete ${emp.first_name} ${emp.last_name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
