import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { NavTab } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { Employee } from './types/employee';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<Employee | null>(null);
  const [dbStatus, setDbStatus] = useState<{ status: string; type: string }>({
    status: 'checking',
    type: 'PostgreSQL',
  });

  // Check health and db connectivity on launch
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await api.getHealth();
        setDbStatus(health.database);
      } catch (err) {
        console.warn('API health check error:', err);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPageInfo = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'Executive Dashboard',
          subtitle: 'Workforce statistics, headcounts, and organizational insights',
        };
      case 'employees':
        return {
          title: 'Employee Management',
          subtitle: 'Search, filter, edit, and organize staff member profiles',
        };
      case 'departments':
        return {
          title: 'Departments & Units',
          subtitle: 'Headcount distribution and department leadership breakdown',
        };
      default:
        return { title: 'EmployeeHub', subtitle: 'Workforce Management System' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <Layout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onOpenAddModal={() => setIsAddModalOpen(true)}
      title={pageInfo.title}
      subtitle={pageInfo.subtitle}
      dbStatus={dbStatus}
    >
      {currentTab === 'dashboard' && (
        <DashboardPage
          onNavigateToEmployees={() => setCurrentTab('employees')}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onViewEmployee={(emp) => setSelectedEmployeeForView(emp)}
        />
      )}

      {currentTab === 'employees' && (
        <EmployeesPage
          isAddModalOpen={isAddModalOpen}
          onCloseAddModal={() => setIsAddModalOpen(false)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          selectedEmployeeForView={selectedEmployeeForView}
          onCloseViewModal={() => setSelectedEmployeeForView(null)}
          onViewEmployee={(emp) => setSelectedEmployeeForView(emp)}
        />
      )}

      {currentTab === 'departments' && (
        <DepartmentsPage
          onSelectDepartment={(_dept) => {
            setCurrentTab('employees');
          }}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      )}
    </Layout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
