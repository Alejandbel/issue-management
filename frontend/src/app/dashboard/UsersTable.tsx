'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import Table, { TableColumn } from '@/components/Table';
import { usersService } from '@/services/api';
import { SortDirection, User } from '@/types';

type UsersTableProps = { defaultUsers: { items: Omit<User, 'password'>[] } };

export function UsersTable({ defaultUsers }: UsersTableProps) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(SortDirection.ASC);

  const {
    data,
    isSuccess,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/users', sortField, sortDirection],
    queryFn: () => usersService.getUsers({
      sortField,
      sortDirection,
    }),
    initialData: defaultUsers,
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
      field: 'endWorksAt',
      header: 'End works at',
      type: 'date',
      editable: true,
      sortable: true,
    },
    {
      field: 'startWorksAt',
      header: 'Start works at',
      type: 'date',
      editable: true,
      sortable: true,
    },
  ];

  const onUpdate = (newValue: Omit<User, 'password'>) => void usersService.updateUser(newValue.id, newValue);
  const onSort = (filed: string, direction?: SortDirection) => {
    setSortField(filed);
    setSortDirection(direction);
  };

  return (
    <Table
      items={data.items}
      first={1}
      totalRecords={data.items.length}
      onUpdate={onUpdate}
      onSort={onSort}
      columns={columns}
      defaultSortField={sortField}
      defaultSortOrder={sortDirection}
    />
  );
}
