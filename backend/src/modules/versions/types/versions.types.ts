import { SortDirection } from '@modules/core';

export type Version = {
  id: number;
  title: string;
  isArchived: boolean;
  projectId: number;
  startDate: Date;
  releaseDate?: Date | null;
  createdAt: Date;
};

export type VersionToUpdate = Omit<Version, 'id' | 'createdAt'>;

export enum VERSION_SORT_FIELD {
  ID = 'id',
  TITLE = 'title',
  IS_ARCHIVED = 'isArchived',
  START_DATE = 'startDate',
  RELeASE_DATE = 'releaseDate',
}

export type VersionListOptions = {
  sortField?: VERSION_SORT_FIELD;
  sortDirection?: SortDirection;
  limit?: number;
  offset?: number;
};
