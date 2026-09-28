import { Request, Response, NextFunction } from 'express';
import { employeeRepository } from '../repositories/employeeRepository';
import { EmployeeQueryParams, EmployeeStatus } from '../types/employee';

export class EmployeeController {
  async getEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        search,
        department,
        status,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      const queryParams: EmployeeQueryParams = {
        search: typeof search === 'string' ? search : undefined,
        department: typeof department === 'string' ? department : undefined,
        status: status === 'ACTIVE' || status === 'INACTIVE' ? (status as EmployeeStatus) : undefined,
        sortBy: typeof sortBy === 'string' ? (sortBy as any) : undefined,
        sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc',
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      };

      const result = await employeeRepository.findMany(queryParams);
      res.status(200).json({
        status: 'success',
        data: result.employees,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const employee = await employeeRepository.findById(id);

      if (!employee) {
        res.status(404).json({
          status: 'error',
          message: `Employee with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;

      // Check unique email
      const existingEmail = await employeeRepository.findByEmail(body.email);
      if (existingEmail) {
        res.status(409).json({
          status: 'error',
          message: `An employee with email '${body.email}' already exists.`,
          field: 'email',
        });
        return;
      }

      // Check unique employee_id if provided
      if (body.employee_id) {
        const existingEmpId = await employeeRepository.findByEmployeeId(body.employee_id);
        if (existingEmpId) {
          res.status(409).json({
            status: 'error',
            message: `Employee ID '${body.employee_id}' is already assigned.`,
            field: 'employee_id',
          });
          return;
        }
      }

      const created = await employeeRepository.create(body);

      res.status(201).json({
        status: 'success',
        message: 'Employee created successfully',
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const body = req.body;

      // Check existence
      const existing = await employeeRepository.findById(id);
      if (!existing) {
        res.status(404).json({
          status: 'error',
          message: `Employee with ID '${id}' not found`,
        });
        return;
      }

      // Check unique email if updating email
      if (body.email && body.email.toLowerCase() !== existing.email.toLowerCase()) {
        const emailConflict = await employeeRepository.findByEmail(body.email, existing.id);
        if (emailConflict) {
          res.status(409).json({
            status: 'error',
            message: `Email '${body.email}' is already in use by another employee.`,
            field: 'email',
          });
          return;
        }
      }

      // Check unique employee_id if updating employee_id
      if (body.employee_id && body.employee_id.toLowerCase() !== existing.employee_id.toLowerCase()) {
        const empIdConflict = await employeeRepository.findByEmployeeId(body.employee_id, existing.id);
        if (empIdConflict) {
          res.status(409).json({
            status: 'error',
            message: `Employee ID '${body.employee_id}' is already taken.`,
            field: 'employee_id',
          });
          return;
        }
      }

      const updated = await employeeRepository.update(id, body);

      res.status(200).json({
        status: 'success',
        message: 'Employee updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const existing = await employeeRepository.findById(id);

      if (!existing) {
        res.status(404).json({
          status: 'error',
          message: `Employee with ID '${id}' not found`,
        });
        return;
      }

      const deleted = await employeeRepository.delete(id);
      if (!deleted) {
        res.status(500).json({
          status: 'error',
          message: 'Failed to delete employee record',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: `Employee ${existing.first_name} ${existing.last_name} (${existing.employee_id}) has been removed.`,
        data: { id: existing.id, employee_id: existing.employee_id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await employeeRepository.getDepartments();
      res.status(200).json({
        status: 'success',
        data: departments,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const employeeController = new EmployeeController();
