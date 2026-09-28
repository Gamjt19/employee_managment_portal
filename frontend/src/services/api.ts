import {
  Employee,
  EmployeeFormData,
  EmployeeFilterParams,
  PaginationMeta,
  DashboardStats,
} from '../types/employee';

// We use relative /api which is proxied by Vite dev server to http://localhost:5000 in dev
// and can be configured with VITE_API_URL in production
const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.errors && Array.isArray(data.errors)
            ? data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
            : data.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err: any) {
      console.error(`API Error on [${options?.method || 'GET'} ${url}]:`, err);
      throw err;
    }
  }

  // Health
  async getHealth(): Promise<{ status: string; database: { status: string; type: string } }> {
    return this.request('/health');
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{ status: string; data: DashboardStats }> {
    return this.request('/dashboard/stats');
  }

  // Departments
  async getDepartments(): Promise<{ status: string; data: string[] }> {
    return this.request('/employees/departments');
  }

  // Employees List
  async getEmployees(
    params: EmployeeFilterParams = {}
  ): Promise<{ status: string; data: Employee[]; pagination: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department) query.append('department', params.department);
    if (params.status) query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/employees${queryString}`);
  }

  // Employee Detail
  async getEmployeeById(id: string): Promise<{ status: string; data: Employee }> {
    return this.request(`/employees/${encodeURIComponent(id)}`);
  }

  // Create Employee
  async createEmployee(employee: EmployeeFormData): Promise<{ status: string; data: Employee; message: string }> {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  // Update Employee
  async updateEmployee(
    id: string,
    updates: Partial<EmployeeFormData>
  ): Promise<{ status: string; data: Employee; message: string }> {
    return this.request(`/employees/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Delete Employee
  async deleteEmployee(id: string): Promise<{ status: string; message: string }> {
    return this.request(`/employees/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
