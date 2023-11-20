import { z } from 'zod';

import { ACCOUNT_SORT_FIELD } from '../types';

import { numberSchema, sortDirectionSchema } from '@modules/core';

export const getAccountsListQuerySchema = z
  .object({
    sortDirection: sortDirectionSchema.nullish(),
    sortField: z.enum(Object.values(ACCOUNT_SORT_FIELD) as [string, ...string[]]).nullish(),
    limit: numberSchema.optional(),
    offset: numberSchema.optional(),
  })
  .strip();

export const updateAccountBodySchema = z
  .object({
    title: z.string().max(255).optional(),
    key: z.string().max(16).optional(),
  })
  .strip()
  .required();

export const createAccountBodySchema = z
  .object({
    title: z.string().max(255),
    key: z.string().max(16),
  })
  .strip()
  .required();
