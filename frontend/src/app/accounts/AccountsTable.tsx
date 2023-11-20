'use client';

import { useQuery } from '@tanstack/react-query';
import { revalidatePath } from 'next/cache';
import React, { FormEvent, useState } from 'react';
import { z } from 'zod';

import { CreateAccountForm } from '@/app/accounts/CreateAccountForm';
import { TableColumn, Table } from '@/components/Table';
import { accountsService } from '@/services/api/accounts.service';
import { Account, SortDirection } from '@/types';
import { validateForm } from '@/utils';

export const createAccountBodySchema = z
  .object({
    title: z.string().max(255),
    key: z.string().max(16),
  })
  .strip()
  .required();

export function AccountsTable() {
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(SortDirection.ASC);
  const [limit, setLimit] = useState<number | undefined>(5);
  const [offset, setOffset] = useState< number | undefined>(0);

  const {
    data,
    isSuccess,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['/accounts', sortField, sortDirection, limit, offset],
    queryFn: () => accountsService.getAccounts({
      sortField,
      sortDirection,
      limit,
      offset,
    }),
  });

  if (!isSuccess || isLoading || error) {
    return null;
  }

  const columns: TableColumn<Account>[] = [
    {
      field: 'id',
      header: 'Id',
      type: 'numeric',
      sortable: true,
    },
    {
      field: 'title',
      header: 'Title',
      type: 'string',
      sortable: true,
      editable: true,
    },
    {
      field: 'key',
      header: 'Key',
      type: 'string',
      sortable: true,
      editable: true,
    },
  ];

  const onUpdate = (newValue: Account) => void accountsService.updateAccount(newValue.id, newValue);
  const onStateChange = (filed: string, direction?: SortDirection, limitState?: number, offsetState?: number) => {
    setSortField(filed);
    setSortDirection(direction);
    setLimit(limitState);
    setOffset(offsetState);
  };

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const account = validateForm(event.currentTarget, createAccountBodySchema);

    await accountsService.createAccount(account);
    refetch();
  };

  return (
    <Table
      items={data.items}
      limit={limit}
      offset={offset}
      totalRecords={data.count}
      onUpdate={onUpdate}
      onStateChange={onStateChange}
      columns={columns}
      defaultSortField={sortField}
      defaultSortOrder={sortDirection}
      limitStep={5}
      onSave={onSave}
      dialogForm={<CreateAccountForm />}
    />
  );
}
