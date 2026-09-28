import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { Badge } from '../components/common/Badge';
import { DashboardStats, DepartmentStat, Employee } from '../types/employee';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  Users,
  UserCheck,
  Briefcase,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DepartmentsPageProps {
  onSelectDepartment: (department: string) => void;
  onOpenAddModal: () => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  onSelectDepartment,
  onOpenAddModal,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, empsRes] = await Promise.all([
          api.getDashboardStats(),
          api.getEmployees({ limit: 100 }),
        ]);
        setStats(statsRes.data);
        setEmployees(empsRes.data);
      } catch (err: any) {
        showToast(err.message || 'Failed to load department statistics', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Group sample members by department
  const membersByDept: Record<string, Employee[]> = {};
  for (const emp of employees) {
    if (!membersByDept[emp.department]) {
      membersByDept[emp.department] = [];
    }
    membersByDept[emp.department].push(emp);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-linear-to-r from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-100 dark:border-violet-950">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Organizational Departments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Overview of team allocations, leadership structures, and department sizes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="md">
            {stats.totalDepartments} Active Departments
          </Badge>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.departmentBreakdown.map((dept: DepartmentStat) => {
          const deptEmployees = membersByDept[dept.department] || [];
          const activePercent = dept.count > 0 ? Math.round((dept.activeCount / dept.count) * 100) : 0;

          return (
            <Card
              key={dept.department}
              hoverEffect
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">
                    {dept.count} {dept.count === 1 ? 'member' : 'members'}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {dept.department}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {dept.activeCount} active • {dept.count - dept.activeCount} inactive
                </p>

                {/* Active Ratio bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Active Rate</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      {activePercent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${activePercent}%` }}
                    />
                  </div>
                </div>

                {/* Team member avatars */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-2">
                    Key Members
                  </span>
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {deptEmployees.slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        title={`${m.first_name} ${m.last_name} (${m.job_title})`}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-linear-to-tr from-slate-600 to-slate-800 text-white text-[10px] font-bold flex items-center justify-center uppercase shadow-xs"
                      >
                        {m.first_name[0]}
                        {m.last_name[0]}
                      </div>
                    ))}
                    {deptEmployees.length > 5 && (
                      <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-[10px] font-semibold items-center justify-center">
                        +{deptEmployees.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Department Staff Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectDepartment(dept.department)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span>Filter Staff</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
