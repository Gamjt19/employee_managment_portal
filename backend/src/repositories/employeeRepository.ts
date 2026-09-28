import { getPool, isPostgresConnected } from '../db/connection';
import { mockStore } from '../db/mockStore';
import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeQueryParams,
  DashboardStats,
} from '../types/employee';

export class EmployeeRepository {
  async findMany(params: EmployeeQueryParams): Promise<{
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const sortBy = params.sortBy || 'created_at';
    const sortOrder = (params.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      const conditions: string[] = [];
      const values: any[] = [];
      let valIdx = 1;

      if (params.search && params.search.trim()) {
        const searchTerm = `%${params.search.trim()}%`;
        conditions.push(
          `(first_name ILIKE $${valIdx} OR last_name ILIKE $${valIdx} OR email ILIKE $${valIdx} OR employee_id ILIKE $${valIdx} OR job_title ILIKE $${valIdx})`
        );
        values.push(searchTerm);
        valIdx++;
      }

      if (params.department && params.department.trim()) {
        conditions.push(`department = $${valIdx}`);
        values.push(params.department.trim());
        valIdx++;
      }

      if (params.status && (params.status === 'ACTIVE' || params.status === 'INACTIVE')) {
        conditions.push(`status = $${valIdx}`);
        values.push(params.status);
        valIdx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Count total
      const countQuery = `SELECT COUNT(*) FROM employees ${whereClause}`;
      const countRes = await pool.query(countQuery, values);
      const total = parseInt(countRes.rows[0].count, 10);

      // Validate sortBy column to avoid SQL injection
      const allowedSortColumns: Record<string, string> = {
        first_name: 'first_name',
        last_name: 'last_name',
        employee_id: 'employee_id',
        department: 'department',
        job_title: 'job_title',
        status: 'status',
        joining_date: 'joining_date',
        created_at: 'created_at',
      };
      const safeSortColumn = allowedSortColumns[sortBy] || 'created_at';

      // Query records
      const selectQuery = `
        SELECT id, employee_id, first_name, last_name, email, phone, department, 
               job_title, status, TO_CHAR(joining_date, 'YYYY-MM-DD') as joining_date,
               salary, address, city, country, created_at, updated_at
        FROM employees
        ${whereClause}
        ORDER BY ${safeSortColumn} ${sortOrder}
        LIMIT $${valIdx} OFFSET $${valIdx + 1}
      `;
      values.push(limit, offset);

      const rowsRes = await pool.query(selectQuery, values);
      return {
        employees: rowsRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    // Fallback: In-memory store
    let list = mockStore.getAll();

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.first_name.toLowerCase().includes(q) ||
          e.last_name.toLowerCase().includes(q) ||
          `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employee_id.toLowerCase().includes(q) ||
          e.job_title.toLowerCase().includes(q)
      );
    }

    if (params.department && params.department.trim()) {
      list = list.filter((e) => e.department.toLowerCase() === params.department?.toLowerCase());
    }

    if (params.status) {
      list = list.filter((e) => e.status === params.status);
    }

    // Sort
    list.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB || '');
        return sortOrder === 'ASC' ? cmp : -cmp;
      }
      if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
      if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
      return 0;
    });

    const total = list.length;
    const paginated = list.slice(offset, offset + limit);

    return {
      employees: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: string): Promise<Employee | null> {
    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      const query = `
        SELECT id, employee_id, first_name, last_name, email, phone, department, 
               job_title, status, TO_CHAR(joining_date, 'YYYY-MM-DD') as joining_date,
               salary, address, city, country, created_at, updated_at
        FROM employees
        WHERE id::text = $1 OR employee_id = $1
        LIMIT 1
      `;
      const res = await pool.query(query, [id]);
      return res.rows[0] || null;
    }

    return mockStore.getById(id) || null;
  }

  async findByEmail(email: string, excludeId?: string): Promise<Employee | null> {
    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      let query = `SELECT * FROM employees WHERE LOWER(email) = LOWER($1)`;
      const values: any[] = [email];
      if (excludeId) {
        query += ` AND id::text != $2 AND employee_id != $2`;
        values.push(excludeId);
      }
      query += ` LIMIT 1`;
      const res = await pool.query(query, values);
      return res.rows[0] || null;
    }

    const emp = mockStore.getByEmail(email);
    if (!emp) return null;
    if (excludeId && (emp.id === excludeId || emp.employee_id === excludeId)) return null;
    return emp;
  }

  async findByEmployeeId(employeeId: string, excludeId?: string): Promise<Employee | null> {
    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      let query = `SELECT * FROM employees WHERE LOWER(employee_id) = LOWER($1)`;
      const values: any[] = [employeeId];
      if (excludeId) {
        query += ` AND id::text != $2`;
        values.push(excludeId);
      }
      query += ` LIMIT 1`;
      const res = await pool.query(query, values);
      return res.rows[0] || null;
    }

    const emp = mockStore.getByEmployeeId(employeeId);
    if (!emp) return null;
    if (excludeId && emp.id === excludeId) return null;
    return emp;
  }

  async create(data: CreateEmployeeInput): Promise<Employee> {
    let empId = data.employee_id;
    if (!empId) {
      if (isPostgresConnected) {
        const pool = getPool();
        const maxRes = await pool?.query(`
          SELECT MAX(SUBSTRING(employee_id FROM 5)::INTEGER) as max_id 
          FROM employees 
          WHERE employee_id ~ '^EMP-[0-9]+$'
        `);
        const maxVal = maxRes?.rows[0]?.max_id ? parseInt(maxRes.rows[0].max_id, 10) : 1000;
        empId = `EMP-${maxVal + 1}`;
      } else {
        empId = mockStore.generateNextEmployeeId();
      }
    }

    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      const query = `
        INSERT INTO employees (
          employee_id, first_name, last_name, email, phone, department,
          job_title, status, joining_date, salary, address, city, country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, employee_id, first_name, last_name, email, phone, department,
                  job_title, status, TO_CHAR(joining_date, 'YYYY-MM-DD') as joining_date,
                  salary, address, city, country, created_at, updated_at
      `;
      const values = [
        empId,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.department,
        data.job_title,
        data.status || 'ACTIVE',
        data.joining_date,
        data.salary || 0,
        data.address || null,
        data.city || null,
        data.country || null,
      ];
      const res = await pool.query(query, values);
      return res.rows[0];
    }

    const newEmp: Employee = {
      id: `e${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      employee_id: empId,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      department: data.department,
      job_title: data.job_title,
      status: data.status || 'ACTIVE',
      joining_date: data.joining_date,
      salary: data.salary || 0,
      address: data.address || null,
      city: data.city || null,
      country: data.country || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return mockStore.create(newEmp);
  }

  async update(id: string, data: UpdateEmployeeInput): Promise<Employee | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      const updates: string[] = [];
      const values: any[] = [];
      let valIdx = 1;

      const fields: Array<keyof UpdateEmployeeInput> = [
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'department',
        'job_title',
        'status',
        'joining_date',
        'salary',
        'address',
        'city',
        'country',
      ];

      for (const field of fields) {
        if (data[field] !== undefined) {
          updates.push(`${field} = $${valIdx}`);
          values.push(data[field]);
          valIdx++;
        }
      }

      if (updates.length === 0) {
        return existing;
      }

      values.push(existing.id);
      const query = `
        UPDATE employees
        SET ${updates.join(', ')}
        WHERE id = $${valIdx}
        RETURNING id, employee_id, first_name, last_name, email, phone, department,
                  job_title, status, TO_CHAR(joining_date, 'YYYY-MM-DD') as joining_date,
                  salary, address, city, country, created_at, updated_at
      `;
      const res = await pool.query(query, values);
      return res.rows[0];
    }

    return mockStore.update(existing.id, data) || null;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;

    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      const res = await pool.query('DELETE FROM employees WHERE id = $1', [existing.id]);
      return (res.rowCount ?? 0) > 0;
    }

    return mockStore.delete(existing.id);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');

      const totalRes = await pool.query(`
        SELECT 
          COUNT(*)::INTEGER as total,
          COUNT(*) FILTER (WHERE status = 'ACTIVE')::INTEGER as active,
          COUNT(*) FILTER (WHERE status = 'INACTIVE')::INTEGER as inactive,
          COUNT(DISTINCT department)::INTEGER as departments
        FROM employees
      `);

      const deptRes = await pool.query(`
        SELECT 
          department,
          COUNT(*)::INTEGER as count,
          COUNT(*) FILTER (WHERE status = 'ACTIVE')::INTEGER as "activeCount"
        FROM employees
        GROUP BY department
        ORDER BY count DESC
      `);

      const recentRes = await pool.query(`
        SELECT id, employee_id, first_name, last_name, email, phone, department,
               job_title, status, TO_CHAR(joining_date, 'YYYY-MM-DD') as joining_date,
               salary, address, city, country, created_at, updated_at
        FROM employees
        ORDER BY joining_date DESC, created_at DESC
        LIMIT 5
      `);

      const row = totalRes.rows[0];
      return {
        totalEmployees: row.total || 0,
        activeEmployees: row.active || 0,
        inactiveEmployees: row.inactive || 0,
        totalDepartments: row.departments || 0,
        departmentBreakdown: deptRes.rows,
        recentEmployees: recentRes.rows,
      };
    }

    const all = mockStore.getAll();
    const activeEmployees = all.filter((e) => e.status === 'ACTIVE').length;
    const inactiveEmployees = all.length - activeEmployees;

    const deptMap: Record<string, { count: number; activeCount: number }> = {};
    for (const emp of all) {
      if (!deptMap[emp.department]) {
        deptMap[emp.department] = { count: 0, activeCount: 0 };
      }
      deptMap[emp.department].count++;
      if (emp.status === 'ACTIVE') {
        deptMap[emp.department].activeCount++;
      }
    }

    const departmentBreakdown = Object.entries(deptMap)
      .map(([department, stats]) => ({
        department,
        count: stats.count,
        activeCount: stats.activeCount,
      }))
      .sort((a, b) => b.count - a.count);

    const recentEmployees = [...all]
      .sort((a, b) => new Date(b.joining_date).getTime() - new Date(a.joining_date).getTime())
      .slice(0, 5);

    return {
      totalEmployees: all.length,
      activeEmployees,
      inactiveEmployees,
      totalDepartments: Object.keys(deptMap).length,
      departmentBreakdown,
      recentEmployees,
    };
  }

  async getDepartments(): Promise<string[]> {
    if (isPostgresConnected) {
      const pool = getPool();
      if (!pool) throw new Error('Database pool not available');
      const res = await pool.query(`SELECT DISTINCT department FROM employees ORDER BY department ASC`);
      return res.rows.map((r) => r.department);
    }

    const depts = Array.from(new Set(mockStore.getAll().map((e) => e.department))).sort();
    return depts;
  }
}

export const employeeRepository = new EmployeeRepository();
