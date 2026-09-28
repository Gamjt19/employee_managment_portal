import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const createEmployeeSchema = z.object({
  employee_id: z.string().trim().regex(/^EMP-\d+$/, 'Employee ID must be in format EMP-XXXX').optional(),
  first_name: z.string().trim().min(2, 'First name must be at least 2 characters').max(100),
  last_name: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().email('Invalid email address format').max(255),
  phone: z.string().trim().min(5, 'Phone number must be at least 5 digits').max(50),
  department: z.string().trim().min(2, 'Department is required').max(100),
  job_title: z.string().trim().min(2, 'Job title is required').max(150),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  joining_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Joining date must be in YYYY-MM-DD format'),
  salary: z.coerce.number().min(0, 'Salary cannot be negative').optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export function validate(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
}
