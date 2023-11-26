export type Project = {
  id: number;
  key: string;
  name: string;
  leadId?: number | null;
  accountId: number;
  departmentId: number;
  createdAt: string;
};

export type ProjectWithRelations = Project & {
  lead?: string | null;
  account: string;
  department: string;
};
