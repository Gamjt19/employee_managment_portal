import { Router } from 'express';
import { employeeController } from '../controllers/employeeController';
import { validate, createEmployeeSchema, updateEmployeeSchema } from '../middleware/validator';

const router = Router();

// GET /api/employees - list employees with search, filters, pagination, sort
router.get('/', (req, res, next) => employeeController.getEmployees(req, res, next));

// GET /api/employees/departments - list distinct departments
router.get('/departments', (req, res, next) => employeeController.getDepartments(req, res, next));

// GET /api/employees/:id - view specific employee details
router.get('/:id', (req, res, next) => employeeController.getEmployeeById(req, res, next));

// POST /api/employees - add employee with validation
router.post('/', validate(createEmployeeSchema), (req, res, next) =>
  employeeController.createEmployee(req, res, next)
);

// PUT /api/employees/:id - edit employee with validation
router.put('/:id', validate(updateEmployeeSchema), (req, res, next) =>
  employeeController.updateEmployee(req, res, next)
);

// DELETE /api/employees/:id - delete employee
router.delete('/:id', (req, res, next) => employeeController.deleteEmployee(req, res, next));

export default router;
