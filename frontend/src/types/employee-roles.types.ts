export const EMPLOYEE_ROLE = {
  ADMIN: 'admin',
  SALES: 'sales',
  PROJECT_MANAGER: 'project_manager',
  USER: 'user',
} as const;

export type Role = typeof EMPLOYEE_ROLE[keyof typeof EMPLOYEE_ROLE];

export type EmployeeRole = {
  id: number;
  title: Role;
  createdAt: Date;
};
