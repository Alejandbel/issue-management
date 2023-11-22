'use client';

import { useQuery } from '@tanstack/react-query';
import React, { FormEvent, useState } from 'react';
import { z } from 'zod';

import { UserForm } from '@/app/users/UserForm';
import { Table, TableColumn } from '@/components/Table';
import { usersService } from '@/services/api';
import { SortDirection, User } from '@/types';
import { validateForm } from '@/utils';

const userSchema = z.object({
  id: z.preprocess(Number, z.number()),
  startWorksAt: z.preprocess((v) => new Date(v), z.date()),
  endWorksAt: z.preprocess((v) => new Date(v), z.date()),
});

export function UsersTable() {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(SortDirection.ASC);
  const [limit, setLimit] = useState<number | undefined>(5);
  const [offset, setOffset] = useState<number | undefined>(0);

  const {
    data,
    isSuccess,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['/users', sortField, sortDirection, limit, offset],
    queryFn: () => usersService.getUsers({
      sortField,
      sortDirection,
      limit,
      offset,
    }),
  });

  if (!isSuccess || isLoading || error) {
    return null;
  }

  const columns: TableColumn<Omit<User, 'password'>>[] = [
    {
      field: 'id',
      header: 'Id',
      type: 'numeric',
      sortable: true,
    },
    {
      field: 'name',
      header: 'Name',
      type: 'string',
      sortable: true,
    },
    {
      field: 'email',
      header: 'Email',
      type: 'string',
      sortable: true,
    },
    {
      field: 'startWorksAt',
      header: 'Start works at',
      type: 'date',
      sortable: true,
    },
    {
      field: 'endWorksAt',
      header: 'End works at',
      type: 'date',
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

    const user = validateForm(event.currentTarget, userSchema);

    if (user.id) {
      await usersService.updateUser(user.id, user);
    }

    await refetch();
  };

  const form = (defaultUser?: Omit<User, 'password'>) => <UserForm defaultUser={defaultUser} />;

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
      actions={['update']}
    />
  );
}
