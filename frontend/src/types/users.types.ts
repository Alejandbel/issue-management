export type User = {
  id: number;
  email: string;
  password: string;
  startWorksAt: Date | null;
  endWorksAt: Date | null;
  roleId: number;
  name: string;
};
