export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  job_title: string;
  status: EmployeeStatus;
  joining_date: string;
  salary?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  employee_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  job_title: string;
  status: EmployeeStatus;
  joining_date: string;
  salary?: number | string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface EmployeeFilterParams {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DepartmentStat {
  department: string;
  count: number;
  activeCount: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  departmentBreakdown: DepartmentStat[];
  recentEmployees: Employee[];
}
