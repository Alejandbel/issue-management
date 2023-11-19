export type EmployeeRole = {
  id: number;
  title: EMPLOYEE_ROLE;
  createdAt: Date;
};

export enum EMPLOYEE_ROLE {
  ADMIN = 'admin',
  SALES = 'sales',
  PROJECT_MANAGER = 'project_manager',
  USER = 'user',
}
