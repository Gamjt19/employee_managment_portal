import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Employee } from '../../types/employee';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Pencil,
  Trash2,
  Clock,
} from 'lucide-react';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete,
}) => {
  if (!employee) return null;

  const initials = `${employee.first_name[0] || ''}${employee.last_name[0] || ''}`.toUpperCase();

  // Calculate approximate tenure
  const joinDate = new Date(employee.joining_date);
  const now = new Date();
  const diffMonths =
    (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  const tenureStr =
    years > 0
      ? `${years} yr${years > 1 ? 's' : ''} ${months} mo${months !== 1 ? 's' : ''}`
      : `${months} month${months !== 1 ? 's' : ''}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Profile" maxWidth="xl">
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-100 dark:border-indigo-900/30">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-500/20 shrink-0">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {employee.first_name} {employee.last_name}
              </h3>
              <Badge
                variant={employee.status === 'ACTIVE' ? 'success' : 'neutral'}
                size="sm"
              >
                {employee.status}
              </Badge>
            </div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
              {employee.job_title}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                {employee.employee_id}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {employee.department}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              Contact Information
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Email Address</span>
                <a
                  href={`mailto:${employee.email}`}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                >
                  {employee.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Phone Number</span>
                <a
                  href={`tel:${employee.phone}`}
                  className="font-medium text-slate-800 dark:text-slate-200 hover:underline"
                >
                  {employee.phone}
                </a>
              </div>
              {(employee.address || employee.city || employee.country) && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Location / Address</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {[employee.address, employee.city, employee.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Job & Organization Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              Job & Organization
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Department</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {employee.department}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Joining Date & Tenure</span>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {employee.joining_date}
                  </span>
                  <span className="text-slate-400">({tenureStr})</span>
                </div>
              </div>
              {employee.salary !== null && employee.salary !== undefined && employee.salary > 0 && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Annual Compensation</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {Number(employee.salary).toLocaleString()} / yr
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audit Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Created: {new Date(employee.created_at).toLocaleDateString()}
          </span>
          <span>
            Last updated: {new Date(employee.updated_at).toLocaleDateString()}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => {
              onClose();
              onDelete(employee);
            }}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Pencil className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
            >
              Edit Employee
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
