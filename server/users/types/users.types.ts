export type User = {
  id: string;
  email: string;
  password: string;
  startWorksAt: Date | null;
  endWorksAt: Date | null;
  roleId: number;
  name: string;
};
