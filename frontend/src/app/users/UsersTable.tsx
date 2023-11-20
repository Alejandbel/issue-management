'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { TableColumn, Table } from '@/components/Table';
import { usersService } from '@/services/api';
import { SortDirection, User } from '@/types';

export function UsersTable() {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(SortDirection.ASC);
  const [limit, setLimit] = useState<number | undefined>(5);
  const [offset, setOffset] = useState< number | undefined>(0);

  const {
    data,
    isSuccess,
    isLoading,
    error,
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
  const onStateChange = (filed: string, direction?: SortDirection, limitState?: number, offsetState?: number) => {
    setSortField(filed);
    setSortDirection(direction);
    setLimit(limitState);
    setOffset(offsetState);
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
    />
  );
}
