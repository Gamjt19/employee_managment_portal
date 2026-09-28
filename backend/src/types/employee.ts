export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string; // UUID
  employee_id: string; // e.g. "EMP-1001"
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  job_title: string;
  status: EmployeeStatus;
  joining_date: string; // YYYY-MM-DD
  salary?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeInput {
  employee_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  job_title: string;
  status?: EmployeeStatus;
  joining_date: string;
  salary?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface UpdateEmployeeInput {
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  job_title?: string;
  status?: EmployeeStatus;
  joining_date?: string;
  salary?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface EmployeeQueryParams {
  search?: string;
  department?: string;
  status?: EmployeeStatus;
  sortBy?: 'first_name' | 'last_name' | 'employee_id' | 'department' | 'job_title' | 'status' | 'joining_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  departmentBreakdown: { department: string; count: number; activeCount: number }[];
  recentEmployees: Employee[];
}
