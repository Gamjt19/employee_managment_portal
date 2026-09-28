# EmployeeHub - Production-Quality Employee Management System

EmployeeHub is a modern, modular, production-ready full-stack Employee Management System designed for enterprise workforce administration, analytics, and record-keeping.

---

## 🚀 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Zod, Morgan, CORS |
| **Database** | PostgreSQL (with connection pooling, automated schema init, and resilient in-memory fallback) |
| **Architecture** | REST API, Layered / Clean Modular Architecture (Routes → Controllers → Services/Repositories → Database) |

---

## 📁 Project Structure

```text
employeehub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts               # Type-safe environment variable parsing
│   │   ├── controllers/
│   │   │   ├── employeeController.ts # Employee CRUD HTTP handlers
│   │   │   └── dashboardController.ts# Aggregate metrics & statistics
│   │   ├── db/
│   │   │   ├── connection.ts        # PostgreSQL pool & auto-init manager
│   │   │   ├── schema.sql           # Tables, constraints, triggers & indexes
│   │   │   ├── seed.sql             # Realistic seed records
│   │   │   ├── init.ts              # Schema runner script (`npm run db:init`)
│   │   │   ├── seed.ts              # Seed runner script (`npm run db:seed`)
│   │   │   └── mockStore.ts         # In-memory fallback dataset & store
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts      # Global error and 404 middleware
│   │   │   └── validator.ts         # Zod request payload schema validation
│   │   ├── repositories/
│   │   │   └── employeeRepository.ts# Abstracted data access layer
│   │   ├── routes/
│   │   │   ├── healthRoutes.ts      # Health check endpoints
│   │   │   ├── employeeRoutes.ts    # /api/employees routes
│   │   │   └── dashboardRoutes.ts   # /api/dashboard routes
│   │   ├── types/
│   │   │   └── employee.ts          # Core TypeScript models and interfaces
│   │   ├── app.ts                   # Express app setup and middleware pipeline
│   │   └── index.ts                 # Server bootstrap & lifecycle management
│   ├── .env.example                 # Backend environment variable template
│   ├── package.json                 # Backend dependencies & scripts
│   └── tsconfig.json                # Backend TypeScript configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Reusable UI (Badge, Button, Card, Modal, Input, Select, etc.)
│   │   │   ├── dashboard/           # StatCard, DepartmentDistribution, StatusBreakdown, RecentEmployees
│   │   │   ├── employees/           # EmployeeTable, EmployeeFilters, FormModal, DetailModal, Pagination
│   │   │   └── layout/              # Sidebar, Header, Layout
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx     # Dark / Light mode provider & local persistence
│   │   │   └── ToastContext.tsx     # Animated Toast notification provider
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx    # Executive dashboard & metrics view
│   │   │   ├── EmployeesPage.tsx    # Comprehensive employee directory & management
│   │   │   └── DepartmentsPage.tsx  # Department overview & headcount allocations
│   │   ├── services/
│   │   │   └── api.ts               # Type-safe API client
│   │   ├── types/
│   │   │   └── employee.ts          # Frontend interfaces and models
│   │   ├── App.tsx                  # Main router and layout coordinator
│   │   ├── main.tsx                 # React DOM root entry
│   │   └── index.css                # Tailwind CSS and global styling tokens
│   ├── index.html                   # HTML template with Inter typography
│   ├── vite.config.ts               # Vite configuration with API proxy and Tailwind
│   ├── package.json                 # Frontend dependencies & scripts
│   └── tsconfig.json                # Frontend TypeScript configuration
│
├── .env.example                     # Root environment variable template
├── .gitignore                       # Git exclusions
├── package.json                     # Root orchestrator with workspaces & dev scripts
└── README.md                        # Documentation
```

---

## 🛠️ Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ or v24+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v13.0 or higher (optional for initial local run; an automatic fallback store activates if PostgreSQL is not yet running)

---

## 📦 Installation

Clone the repository and install all dependencies for both frontend and backend:

```bash
# 1. Install root, backend, and frontend dependencies
npm install

# Or install individually if preferred:
cd backend && npm install
cd ../frontend && npm install
```

---

## 🗄️ PostgreSQL Configuration

### 1. Create the Database
In your PostgreSQL client (`psql`, pgAdmin, DBeaver, etc.):

```sql
CREATE DATABASE employeehub;
```

### 2. Configure Environment Variables
Copy `.env.example` in `backend/` (or the root directory) to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL credentials:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Option 1: Standard Connection URL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/employeehub

# Option 2: Individual variables
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=employeehub
DB_SSL=false

# Resilient fallback mode (if true, falls back to in-memory store if DB is unreachable)
USE_MOCK_FALLBACK=true
```

### 3. Initialize & Seed Database Schema
Run the automated schema creation and seed scripts:

```bash
# Apply schema tables, indexes, constraints, and triggers
npm run db:init

# Insert realistic sample employee records
npm run db:seed
```

*(Note: The server also auto-verifies and creates tables on startup upon establishing a PostgreSQL connection).*

---

## 🏃 Running the Application

### Option A: Run Both Services Concurrently (Recommended)
From the root directory:

```bash
npm run dev
```

This starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

### Option B: Run Services Separately

**1. Start Backend:**
```bash
cd backend
npm run dev
```

**2. Start Frontend:**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your web browser.

---

## 🌐 Available API Endpoints

### Health & Monitoring
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns service health, uptime, and database connection status |

### Dashboard & Analytics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Aggregated total/active/inactive counts, department breakdown, and recent employees |

### Employee Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/employees` | List employees with pagination, search, filters, and sorting |
| `GET` | `/api/employees/departments`| List all distinct departments in the system |
| `GET` | `/api/employees/:id` | Fetch detailed record for an employee by UUID or Employee ID |
| `POST` | `/api/employees` | Create a new employee record with validation |
| `PUT` | `/api/employees/:id` | Update an existing employee with validation |
| `DELETE` | `/api/employees/:id` | Permanently delete an employee record |

---

### Query Parameters for `GET /api/employees`

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | `""` | Search against `first_name`, `last_name`, `email`, `employee_id`, and `job_title` |
| `department` | `string` | `""` | Filter by department (e.g. `Engineering`, `Marketing`) |
| `status` | `string` | `""` | Filter by status (`ACTIVE` or `INACTIVE`) |
| `sortBy` | `string` | `created_at` | Sort column (`first_name`, `employee_id`, `department`, `joining_date`, etc.) |
| `sortOrder` | `string` | `desc` | Sort direction (`asc` or `desc`) |
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Records per page (1 to 100) |

---

### Sample Employee Payloads

#### `POST /api/employees` Request Body:
```json
{
  "employee_id": "EMP-1015",
  "first_name": "Daniel",
  "last_name": "Kim",
  "email": "daniel.kim@employeehub.com",
  "phone": "+1 (555) 777-6655",
  "department": "Engineering",
  "job_title": "Principal Architect",
  "status": "ACTIVE",
  "joining_date": "2024-06-15",
  "salary": 165000,
  "address": "400 California Street",
  "city": "San Francisco",
  "country": "United States"
}
```

#### `GET /api/employees/:id` Response:
```json
{
  "status": "success",
  "data": {
    "id": "e1001-a1b2-c3d4-e5f6-7890abcdef01",
    "employee_id": "EMP-1001",
    "first_name": "Sarah",
    "last_name": "Jenkins",
    "email": "sarah.jenkins@employeehub.com",
    "phone": "+1 (555) 234-5678",
    "department": "Engineering",
    "job_title": "Staff Software Engineer",
    "status": "ACTIVE",
    "joining_date": "2023-03-15",
    "salary": 145000,
    "address": "742 Evergreen Terrace",
    "city": "San Francisco",
    "country": "United States",
    "created_at": "2023-03-15T09:00:00.000Z",
    "updated_at": "2023-03-15T09:00:00.000Z"
  }
}
```

---

## 🚢 Prepared for Future Containerization & Cloud Deployment

The application is structured to facilitate seamless containerization and deployment:
- **Clean separation**: Frontend and Backend are decoupled and communicate through standard REST interfaces.
- **Stateless Backend**: Backend communicates with external PostgreSQL via standard environment variables (`DATABASE_URL`, `PGHOST`, etc.).
- **Vite Production Bundle**: Frontend compiles down to static HTML/CSS/JS ready for Nginx or CDN serving.
- **Kubernetes / AKS Readiness**: Health check endpoint `/api/health` is ready for Kubernetes liveness and readiness probes (`livenessProbe` and `readinessProbe`).
- **No hardcoded credentials**: All connection endpoints and port bindings are configurable via environment variables.
#   e m p l o y e e _ m a n a g m e n t _ p o r t a l  
 