import { z } from 'zod';

import { getUsersListQuerySchema, updateUserBodySchema } from '../schemas';

import { SortDirection } from '@modules/core';
import { EMPLOYEE_ROLE } from '@modules/users';

export type User = {
  id: number;
  email: string;
  password: string;
  startWorksAt: Date | null;
  endWorksAt: Date | null;
  roleId: number;
  name: string;
};

export type UserWithRole = {
  id: number;
  email: string;
  startWorksAt: Date | null;
  endWorksAt: Date | null;
  role: EMPLOYEE_ROLE;
  name: string;
};

export type UserToUpdate = z.infer<typeof updateUserBodySchema>;

export type UsersListOptions = {
  sortField: USERS_SORT_FIELD;
  sortDirection: SortDirection;
};

export enum USERS_SORT_FIELD {
  ID = 'id',
  EMAIL = 'email',
  PASSWORD = 'password',
  START_WORKS_AT = 'startWorksAt',
  END_WORKS_AT = 'endWorksAt',
  NAME = 'name',
}
