import React, { useState, useEffect, useCallback } from 'react';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeFilters } from '../components/employees/EmployeeFilters';
import { Pagination } from '../components/employees/Pagination';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { EmployeeDetailModal } from '../components/employees/EmployeeDetailModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Button } from '../components/common/Button';
import {
  Employee,
  EmployeeFilterParams,
  EmployeeFormData,
  PaginationMeta,
} from '../types/employee';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Plus, Download } from 'lucide-react';

interface EmployeesPageProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
  selectedEmployeeForView: Employee | null;
  onCloseViewModal: () => void;
  onViewEmployee: (emp: Employee) => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
  selectedEmployeeForView,
  onCloseViewModal,
  onViewEmployee,
}) => {
  const { showToast } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filters, setFilters] = useState<EmployeeFilterParams>({
    search: '',
    department: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Modal states
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Fetch departments list
  const fetchDepartments = useCallback(async () => {
    try {
      const res = await api.getDepartments();
      setDepartments(res.data);
    } catch (err: any) {
      console.error('Failed to fetch departments:', err);
    }
  }, []);

  // Fetch employees list
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getEmployees(filters);
      setEmployees(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      showToast(err.message || 'Failed to load employees', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handlers for Filters
  const handleFilterChange = (updates: Partial<EmployeeFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: '',
      status: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
  };

  const handleSortChange = (column: string) => {
    setFilters((prev) => {
      if (prev.sortBy === column) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
          page: 1,
        };
      }
      return {
        ...prev,
        sortBy: column,
        sortOrder: 'asc',
        page: 1,
      };
    });
  };

  // CRUD Handlers
  const handleCreateEmployee = async (formData: EmployeeFormData) => {
    try {
      setIsSubmitting(true);
      const res = await api.createEmployee(formData);
      showToast(res.message || 'Employee created successfully!', 'success');
      onCloseAddModal();
      fetchEmployees();
      fetchDepartments();
    } catch (err: any) {
      showToast(err.message || 'Failed to create employee', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (formData: EmployeeFormData) => {
    if (!editingEmployee) return;
    try {
      setIsSubmitting(true);
      const res = await api.updateEmployee(editingEmployee.id, formData);
      showToast(res.message || 'Employee updated successfully!', 'success');
      setEditingEmployee(null);
      fetchEmployees();
      fetchDepartments();
    } catch (err: any) {
      showToast(err.message || 'Failed to update employee', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    try {
      setIsSubmitting(true);
      const res = await api.deleteEmployee(deletingEmployee.id);
      showToast(res.message || 'Employee removed successfully', 'success');
      setDeletingEmployee(null);
      fetchEmployees();
      fetchDepartments();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete employee', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV helper
  const handleExportCSV = () => {
    if (employees.length === 0) return;
    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Job Title',
      'Status',
      'Joining Date',
      'Salary',
      'City',
      'Country',
    ];
    const rows = employees.map((e) => [
      `"${e.employee_id}"`,
      `"${e.first_name}"`,
      `"${e.last_name}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.department}"`,
      `"${e.job_title}"`,
      `"${e.status}"`,
      `"${e.joining_date}"`,
      `"${e.salary || 0}"`,
      `"${e.city || ''}"`,
      `"${e.country || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Employee roster exported to CSV', 'info');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Employee Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage, filter, and review all staff records and organizational allocations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
            disabled={employees.length === 0}
          >
            Export CSV
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

      {/* Filter Bar */}
      <EmployeeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        departments={departments}
        totalCount={pagination.total}
      />

      {/* Employee Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        onViewEmployee={onViewEmployee}
        onEditEmployee={(emp) => setEditingEmployee(emp)}
        onDeleteEmployee={(emp) => setDeletingEmployee(emp)}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination Bar */}
      {!isLoading && employees.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={filters.limit || 10}
          onPageChange={(page) => handleFilterChange({ page })}
          onPageSizeChange={(limit) => handleFilterChange({ limit, page: 1 })}
        />
      )}

      {/* Add Employee Modal */}
      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onSubmit={handleCreateEmployee}
        departments={departments}
        isLoading={isSubmitting}
      />

      {/* Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        onSubmit={handleUpdateEmployee}
        initialData={editingEmployee}
        departments={departments}
        isLoading={isSubmitting}
      />

      {/* View Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={Boolean(selectedEmployeeForView)}
        onClose={onCloseViewModal}
        employee={selectedEmployeeForView}
        onEdit={(emp) => {
          onCloseViewModal();
          setEditingEmployee(emp);
        }}
        onDelete={(emp) => {
          onCloseViewModal();
          setDeletingEmployee(emp);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Employee Deletion"
        message={`Are you sure you want to permanently delete ${deletingEmployee?.first_name} ${deletingEmployee?.last_name} (${deletingEmployee?.employee_id})? This will remove all their profiles, assignments, and records from the database.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Cancel"
        isLoading={isSubmitting}
      />
    </div>
  );
};
