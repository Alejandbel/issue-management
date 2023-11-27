export type Issue = {
  id: number;
  typeId: number;
  key: string;
  summary: string;
  versionId: number;
  hoursEstimated: number;
  assigneeId: number;
  dueDate: Date;
  description: string;
  statusId: number;
  projectId: number;
  startDate: Date;
  releaseDate?: Date | null;
  createdAt: Date;
};

export type IssueWithTypeAndStatus = Issue & {
  type: string;
  status: string;
};
