'use client';

import { useQuery } from '@tanstack/react-query';
import React, { FormEvent, useState } from 'react';
import { z } from 'zod';

import { AccountForm } from '@/app/accounts/AccountForm';
import { TableColumn, Table } from '@/components/Table';
import { accountsService } from '@/services/api/accounts.service';
import { Account, SortDirection } from '@/types';
import { validateForm } from '@/utils';

export const accountBodySchema = z
  .object({
    id: z.preprocess(Number, z.number()).optional(),
    title: z.string().max(255),
    key: z.string().max(16),
  })
  .strip();

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
    },
    {
      field: 'key',
      header: 'Key',
      type: 'string',
      sortable: true,
    },
  ];

  const onStateChange = (filed: string, direction?: SortDirection, limitState?: number, offsetState?: number) => {
    setSortField(filed);
    setSortDirection(direction);
    setLimit(limitState);
    setOffset(offsetState);
  };

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const account = validateForm(event.currentTarget, accountBodySchema);

    if (account.id) {
      await accountsService.updateAccount(account.id, account);
    } else {
      await accountsService.createAccount(account);
    }

    await refetch();
  };

  const form = (defaultAccount?: Account) => <AccountForm defaultAccount={defaultAccount} />;

  return (
    <Table
      items={data.items}
      limit={limit}
      offset={offset}
      totalRecords={data.count}
      onStateChange={onStateChange}
      columns={columns}
      defaultSortField={sortField}
      defaultSortOrder={sortDirection}
      limitStep={5}
      onSave={onSave}
      dialogForm={form}
      actions={['update', 'create']}
    />
  );
}
