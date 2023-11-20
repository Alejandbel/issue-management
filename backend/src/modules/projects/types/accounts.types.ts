import { SortDirection } from '@modules/core';

export type Account = {
  id: number;
  title: string;
  key: string;
  createdAt: Date;
};

export type AccountToUpdate = Pick<Account, 'title' | 'key'>;

export type AccountsListOptions = {
  sortField: ACCOUNT_SORT_FIELD;
  sortDirection: SortDirection;
};

export enum ACCOUNT_SORT_FIELD {
  ID = 'id',
  TITLE = 'title',
  KEY = 'key',
}
