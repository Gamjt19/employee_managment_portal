import { Employee, EmployeeStatus } from '../types/employee';

// High-quality initial mock dataset for development and preview
export const initialEmployees: Employee[] = [
  {
    id: 'e1001-a1b2-c3d4-e5f6-7890abcdef01',
    employee_id: 'EMP-1001',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    email: 'sarah.jenkins@employeehub.com',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    job_title: 'Staff Software Engineer',
    status: 'ACTIVE',
    joining_date: '2023-03-15',
    salary: 145000,
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    country: 'United States',
    created_at: new Date('2023-03-15T09:00:00Z').toISOString(),
    updated_at: new Date('2023-03-15T09:00:00Z').toISOString(),
  },
  {
    id: 'e1002-a1b2-c3d4-e5f6-7890abcdef02',
    employee_id: 'EMP-1002',
    first_name: 'Marcus',
    last_name: 'Chen',
    email: 'marcus.chen@employeehub.com',
    phone: '+1 (555) 345-6789',
    department: 'Product',
    job_title: 'Senior Product Manager',
    status: 'ACTIVE',
    joining_date: '2023-05-01',
    salary: 138000,
    address: '120 Market Street, Suite 400',
    city: 'Seattle',
    country: 'United States',
    created_at: new Date('2023-05-01T09:00:00Z').toISOString(),
    updated_at: new Date('2023-05-01T09:00:00Z').toISOString(),
  },
  {
    id: 'e1003-a1b2-c3d4-e5f6-7890abcdef03',
    employee_id: 'EMP-1003',
    first_name: 'Elena',
    last_name: 'Rostova',
    email: 'elena.rostova@employeehub.com',
    phone: '+1 (555) 456-7890',
    department: 'Design',
    job_title: 'Lead Product Designer',
    status: 'ACTIVE',
    joining_date: '2023-07-10',
    salary: 125000,
    address: '88 Broadway Avenue',
    city: 'New York',
    country: 'United States',
    created_at: new Date('2023-07-10T09:00:00Z').toISOString(),
    updated_at: new Date('2023-07-10T09:00:00Z').toISOString(),
  },
  {
    id: 'e1004-a1b2-c3d4-e5f6-7890abcdef04',
    employee_id: 'EMP-1004',
    first_name: 'David',
    last_name: 'Kim',
    email: 'david.kim@employeehub.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    job_title: 'DevOps & Cloud Architect',
    status: 'ACTIVE',
    joining_date: '2023-09-01',
    salary: 150000,
    address: '500 Technology Way',
    city: 'Austin',
    country: 'United States',
    created_at: new Date('2023-09-01T09:00:00Z').toISOString(),
    updated_at: new Date('2023-09-01T09:00:00Z').toISOString(),
  },
  {
    id: 'e1005-a1b2-c3d4-e5f6-7890abcdef05',
    employee_id: 'EMP-1005',
    first_name: 'Amara',
    last_name: 'Okafor',
    email: 'amara.okafor@employeehub.com',
    phone: '+1 (555) 678-9012',
    department: 'Human Resources',
    job_title: 'Head of People & Culture',
    status: 'ACTIVE',
    joining_date: '2023-11-20',
    salary: 118000,
    address: '220 Michigan Avenue',
    city: 'Chicago',
    country: 'United States',
    created_at: new Date('2023-11-20T09:00:00Z').toISOString(),
    updated_at: new Date('2023-11-20T09:00:00Z').toISOString(),
  },
  {
    id: 'e1006-a1b2-c3d4-e5f6-7890abcdef06',
    employee_id: 'EMP-1006',
    first_name: 'James',
    last_name: 'Wilson',
    email: 'james.wilson@employeehub.com',
    phone: '+1 (555) 789-0123',
    department: 'Marketing',
    job_title: 'Director of Growth Marketing',
    status: 'ACTIVE',
    joining_date: '2024-01-15',
    salary: 130000,
    address: '15 Ocean Blvd',
    city: 'Miami',
    country: 'United States',
    created_at: new Date('2024-01-15T09:00:00Z').toISOString(),
    updated_at: new Date('2024-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'e1007-a1b2-c3d4-e5f6-7890abcdef07',
    employee_id: 'EMP-1007',
    first_name: 'Priya',
    last_name: 'Patel',
    email: 'priya.patel@employeehub.com',
    phone: '+1 (555) 890-1234',
    department: 'Finance',
    job_title: 'Senior Financial Analyst',
    status: 'ACTIVE',
    joining_date: '2024-02-01',
    salary: 112000,
    address: '45 Wall Street',
    city: 'New York',
    country: 'United States',
    created_at: new Date('2024-02-01T09:00:00Z').toISOString(),
    updated_at: new Date('2024-02-01T09:00:00Z').toISOString(),
  },
  {
    id: 'e1008-a1b2-c3d4-e5f6-7890abcdef08',
    employee_id: 'EMP-1008',
    first_name: 'Lucas',
    last_name: 'Müller',
    email: 'lucas.mueller@employeehub.com',
    phone: '+1 (555) 901-2345',
    department: 'Engineering',
    job_title: 'Frontend Engineer',
    status: 'ACTIVE',
    joining_date: '2024-03-10',
    salary: 105000,
    address: '101 Pine Street',
    city: 'Denver',
    country: 'United States',
    created_at: new Date('2024-03-10T09:00:00Z').toISOString(),
    updated_at: new Date('2024-03-10T09:00:00Z').toISOString(),
  },
  {
    id: 'e1009-a1b2-c3d4-e5f6-7890abcdef09',
    employee_id: 'EMP-1009',
    first_name: 'Sofia',
    last_name: 'Alvarez',
    email: 'sofia.alvarez@employeehub.com',
    phone: '+1 (555) 012-3456',
    department: 'Sales',
    job_title: 'Enterprise Account Executive',
    status: 'INACTIVE',
    joining_date: '2023-04-01',
    salary: 110000,
    address: '300 Sunset Boulevard',
    city: 'Los Angeles',
    country: 'United States',
    created_at: new Date('2023-04-01T09:00:00Z').toISOString(),
    updated_at: new Date('2024-01-20T09:00:00Z').toISOString(),
  },
  {
    id: 'e1010-a1b2-c3d4-e5f6-7890abcdef10',
    employee_id: 'EMP-1010',
    first_name: 'Liam',
    last_name: 'Davies',
    email: 'liam.davies@employeehub.com',
    phone: '+1 (555) 123-7890',
    department: 'Operations',
    job_title: 'Operations Manager',
    status: 'ACTIVE',
    joining_date: '2024-04-18',
    salary: 98000,
    address: '77 Commerce Way',
    city: 'Boston',
    country: 'United States',
    created_at: new Date('2024-04-18T09:00:00Z').toISOString(),
    updated_at: new Date('2024-04-18T09:00:00Z').toISOString(),
  },
  {
    id: 'e1011-a1b2-c3d4-e5f6-7890abcdef11',
    employee_id: 'EMP-1011',
    first_name: 'Chloe',
    last_name: 'Dubois',
    email: 'chloe.dubois@employeehub.com',
    phone: '+1 (555) 234-8901',
    department: 'Engineering',
    job_title: 'Backend Systems Engineer',
    status: 'ACTIVE',
    joining_date: '2024-05-12',
    salary: 120000,
    address: '90 Pioneer Square',
    city: 'Portland',
    country: 'United States',
    created_at: new Date('2024-05-12T09:00:00Z').toISOString(),
    updated_at: new Date('2024-05-12T09:00:00Z').toISOString(),
  },
  {
    id: 'e1012-a1b2-c3d4-e5f6-7890abcdef12',
    employee_id: 'EMP-1012',
    first_name: 'Tariq',
    last_name: 'Mansour',
    email: 'tariq.mansour@employeehub.com',
    phone: '+1 (555) 345-9012',
    department: 'Marketing',
    job_title: 'Content & Brand Strategist',
    status: 'INACTIVE',
    joining_date: '2023-08-15',
    salary: 88000,
    address: '42 Peachtree Street',
    city: 'Atlanta',
    country: 'United States',
    created_at: new Date('2023-08-15T09:00:00Z').toISOString(),
    updated_at: new Date('2024-02-15T09:00:00Z').toISOString(),
  }
];

class MockEmployeeStore {
  private employees: Employee[] = [...initialEmployees];

  getAll(filterFn?: (emp: Employee) => boolean): Employee[] {
    if (filterFn) {
      return this.employees.filter(filterFn);
    }
    return [...this.employees];
  }

  getById(id: string): Employee | undefined {
    return this.employees.find(emp => emp.id === id || emp.employee_id === id);
  }

  getByEmail(email: string): Employee | undefined {
    return this.employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
  }

  getByEmployeeId(employeeId: string): Employee | undefined {
    return this.employees.find(emp => emp.employee_id.toLowerCase() === employeeId.toLowerCase());
  }

  create(emp: Employee): Employee {
    this.employees.unshift(emp);
    return emp;
  }

  update(id: string, updates: Partial<Employee>): Employee | undefined {
    const index = this.employees.findIndex(emp => emp.id === id || emp.employee_id === id);
    if (index === -1) return undefined;

    this.employees[index] = {
      ...this.employees[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.employees[index];
  }

  delete(id: string): boolean {
    const index = this.employees.findIndex(emp => emp.id === id || emp.employee_id === id);
    if (index === -1) return false;
    this.employees.splice(index, 1);
    return true;
  }

  generateNextEmployeeId(): string {
    const maxNum = this.employees.reduce((max, emp) => {
      const match = emp.employee_id.match(/EMP-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 1000);
    return `EMP-${maxNum + 1}`;
  }
}

export const mockStore = new MockEmployeeStore();
