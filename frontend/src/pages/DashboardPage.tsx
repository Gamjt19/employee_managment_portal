import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentDistribution } from '../components/dashboard/DepartmentDistribution';
import { StatusBreakdown } from '../components/dashboard/StatusBreakdown';
import { RecentEmployeesTable } from '../components/dashboard/RecentEmployeesTable';
import { Skeleton } from '../components/common/Skeleton';
import { DashboardStats, Employee } from '../types/employee';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Button } from '../components/common/Button';

interface DashboardPageProps {
  onNavigateToEmployees: () => void;
  onOpenAddModal: () => void;
  onViewEmployee: (emp: Employee) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToEmployees,
  onOpenAddModal,
  onViewEmployee,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const res = await api.getDashboardStats();
      setStats(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch dashboard metrics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-linear-to-r from-indigo-900/10 via-purple-900/5 to-transparent p-5 rounded-2xl border border-indigo-100 dark:border-indigo-950">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Workforce Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics, headcounts, and organizational metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={loadStats}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenAddModal}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          colorScheme="indigo"
          subtext="Total workforce registered"
          trend={{ value: '+12% this quarter', isPositive: true }}
        />
        <StatCard
          label="Active Employees"
          value={stats.activeEmployees}
          icon={UserCheck}
          colorScheme="emerald"
          subtext="Currently on active duty"
          trend={{ value: `${Math.round((stats.activeEmployees / (stats.totalEmployees || 1)) * 100)}% rate`, isPositive: true }}
        />
        <StatCard
          label="Inactive Employees"
          value={stats.inactiveEmployees}
          icon={UserX}
          colorScheme="amber"
          subtext="On leave or offboarded"
        />
        <StatCard
          label="Departments"
          value={stats.totalDepartments}
          icon={Building2}
          colorScheme="sky"
          subtext="Distinct operating units"
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentDistribution
          departments={stats.departmentBreakdown}
          totalEmployees={stats.totalEmployees}
        />
        <StatusBreakdown
          totalEmployees={stats.totalEmployees}
          activeEmployees={stats.activeEmployees}
          inactiveEmployees={stats.inactiveEmployees}
        />
      </div>

      {/* Recent Employees Widget */}
      <RecentEmployeesTable
        employees={stats.recentEmployees}
        onViewEmployee={onViewEmployee}
        onViewAll={onNavigateToEmployees}
      />
    </div>
  );
};
