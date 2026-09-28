-- EmployeeHub Initial Seed Data for PostgreSQL
INSERT INTO employees (
    employee_id, first_name, last_name, email, phone, department, job_title, status, joining_date, salary, address, city, country
) VALUES
('EMP-1001', 'Sarah', 'Jenkins', 'sarah.jenkins@employeehub.com', '+1 (555) 234-5678', 'Engineering', 'Staff Software Engineer', 'ACTIVE', '2023-03-15', 145000, '742 Evergreen Terrace', 'San Francisco', 'United States'),
('EMP-1002', 'Marcus', 'Chen', 'marcus.chen@employeehub.com', '+1 (555) 345-6789', 'Product', 'Senior Product Manager', 'ACTIVE', '2023-05-01', 138000, '120 Market Street, Suite 400', 'Seattle', 'United States'),
('EMP-1003', 'Elena', 'Rostova', 'elena.rostova@employeehub.com', '+1 (555) 456-7890', 'Design', 'Lead Product Designer', 'ACTIVE', '2023-07-10', 125000, '88 Broadway Avenue', 'New York', 'United States'),
('EMP-1004', 'David', 'Kim', 'david.kim@employeehub.com', '+1 (555) 567-8901', 'Engineering', 'DevOps & Cloud Architect', 'ACTIVE', '2023-09-01', 150000, '500 Technology Way', 'Austin', 'United States'),
('EMP-1005', 'Amara', 'Okafor', 'amara.okafor@employeehub.com', '+1 (555) 678-9012', 'Human Resources', 'Head of People & Culture', 'ACTIVE', '2023-11-20', 118000, '220 Michigan Avenue', 'Chicago', 'United States'),
('EMP-1006', 'James', 'Wilson', 'james.wilson@employeehub.com', '+1 (555) 789-0123', 'Marketing', 'Director of Growth Marketing', 'ACTIVE', '2024-01-15', 130000, '15 Ocean Blvd', 'Miami', 'United States'),
('EMP-1007', 'Priya', 'Patel', 'priya.patel@employeehub.com', '+1 (555) 890-1234', 'Finance', 'Senior Financial Analyst', 'ACTIVE', '2024-02-01', 112000, '45 Wall Street', 'New York', 'United States'),
('EMP-1008', 'Lucas', 'Müller', 'lucas.mueller@employeehub.com', '+1 (555) 901-2345', 'Engineering', 'Frontend Engineer', 'ACTIVE', '2024-03-10', 105000, '101 Pine Street', 'Denver', 'United States'),
('EMP-1009', 'Sofia', 'Alvarez', 'sofia.alvarez@employeehub.com', '+1 (555) 012-3456', 'Sales', 'Enterprise Account Executive', 'INACTIVE', '2023-04-01', 110000, '300 Sunset Boulevard', 'Los Angeles', 'United States'),
('EMP-1010', 'Liam', 'Davies', 'liam.davies@employeehub.com', '+1 (555) 123-7890', 'Operations', 'Operations Manager', 'ACTIVE', '2024-04-18', 98000, '77 Commerce Way', 'Boston', 'United States'),
('EMP-1011', 'Chloe', 'Dubois', 'chloe.dubois@employeehub.com', '+1 (555) 234-8901', 'Engineering', 'Backend Systems Engineer', 'ACTIVE', '2024-05-12', 120000, '90 Pioneer Square', 'Portland', 'United States'),
('EMP-1012', 'Tariq', 'Mansour', 'tariq.mansour@employeehub.com', '+1 (555) 345-9012', 'Marketing', 'Content & Brand Strategist', 'INACTIVE', '2023-08-15', 88000, '42 Peachtree Street', 'Atlanta', 'United States')
ON CONFLICT (employee_id) DO NOTHING;
