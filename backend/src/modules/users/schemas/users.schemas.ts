import { z } from 'zod';

import { USERS_SORT_FIELD } from '../types';

import { dateSchema, numberSchema, sortDirectionSchema } from '@modules/core';

export const getUsersListQuerySchema = z
  .object({
    sortDirection: sortDirectionSchema.nullish(),
    sortField: z.enum(Object.values(USERS_SORT_FIELD) as [string, ...string[]]).nullish(),
    limit: numberSchema.optional(),
    offset: numberSchema.optional(),
  })
  .strip();

export const updateUserBodySchema = z
  .object({
    startWorksAt: dateSchema.optional(),
    endWorksAt: dateSchema.optional(),
  })
  .strip()
  .required();
