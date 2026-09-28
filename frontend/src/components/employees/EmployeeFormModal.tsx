import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Employee, EmployeeFormData, EmployeeStatus } from '../../types/employee';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  departments: string[];
  isLoading: boolean;
}

const DEFAULT_DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Finance',
  'Human Resources',
  'Sales',
  'Operations',
  'Legal',
  'Customer Success',
];

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments,
  isLoading,
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    job_title: '',
    status: 'ACTIVE',
    joining_date: new Date().toISOString().split('T')[0],
    salary: '',
    address: '',
    city: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id,
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email,
        phone: initialData.phone,
        department: initialData.department,
        job_title: initialData.job_title,
        status: initialData.status,
        joining_date: initialData.joining_date,
        salary: initialData.salary ?? '',
        address: initialData.address || '',
        city: initialData.city || '',
        country: initialData.country || '',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        job_title: '',
        status: 'ACTIVE',
        joining_date: new Date().toISOString().split('T')[0],
        salary: '',
        address: '',
        city: '',
        country: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 5) {
      newErrors.phone = 'Phone number must have at least 5 digits';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }

    if (!formData.joining_date) {
      newErrors.joining_date = 'Joining date is required';
    }

    if (formData.employee_id && !/^EMP-\d+$/.test(formData.employee_id)) {
      newErrors.employee_id = 'Employee ID must follow format EMP-XXXX (e.g. EMP-1015)';
    }

    if (formData.salary && Number(formData.salary) < 0) {
      newErrors.salary = 'Salary must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        salary: formData.salary ? Number(formData.salary) : null,
      });
    } catch (err: any) {
      // Backend validation error mapping if applicable
      if (err.message && err.message.includes('email')) {
        setErrors((prev) => ({ ...prev, email: err.message }));
      } else if (err.message && err.message.includes('employee_id')) {
        setErrors((prev) => ({ ...prev, employee_id: err.message }));
      }
    }
  };

  const allDepartments = Array.from(new Set([...DEFAULT_DEPARTMENTS, ...departments]));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Employee: ${initialData?.first_name} ${initialData?.last_name}` : 'Add New Employee'}
      description={
        isEditing
          ? 'Update the employee details and organizational records below.'
          : 'Fill in the information below to register a new employee into the system.'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            1. Personal & Identity
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              error={errors.first_name}
              placeholder="e.g. Sarah"
            />
            <Input
              label="Last Name"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              error={errors.last_name}
              placeholder="e.g. Jenkins"
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="sarah.jenkins@company.com"
            />
            <Input
              label="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="+1 (555) 234-5678"
            />
          </div>
        </div>

        {/* Section 2: Job & Role */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            2. Job & Organization
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={allDepartments.map((dept) => ({ value: dept, label: dept }))}
              error={errors.department}
            />
            <Input
              label="Job Title"
              required
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              error={errors.job_title}
              placeholder="e.g. Senior Software Engineer"
            />
            <Select
              label="Employment Status"
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
              ]}
            />
            <Input
              label="Joining Date"
              type="date"
              required
              value={formData.joining_date}
              onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
              error={errors.joining_date}
            />
            <Input
              label="Employee ID (Optional)"
              value={formData.employee_id || ''}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              error={errors.employee_id}
              placeholder="e.g. EMP-1015 (auto-generated if left empty)"
              helperText="Auto-assigned sequentially if left blank"
            />
            <Input
              label="Annual Salary ($)"
              type="number"
              min="0"
              step="1000"
              value={formData.salary ?? ''}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              error={errors.salary}
              placeholder="e.g. 120000"
            />
          </div>
        </div>

        {/* Section 3: Location / Address */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            3. Location & Address (Optional)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <Input
                label="Street Address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 100 Main Street, Suite 400"
              />
            </div>
            <Input
              label="City"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. San Francisco"
            />
            <Input
              label="Country"
              value={formData.country || ''}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="e.g. United States"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="md" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
