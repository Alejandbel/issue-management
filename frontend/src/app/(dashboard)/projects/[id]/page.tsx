'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import { Table, TableColumn } from '@/components/Table';
import { versionsService } from '@/services/api';
import { IssueWithTypeAndStatus, SortDirection, VersionWithIssues } from '@/types';

export default function Page() {
  const { id } = useParams();
  const projectId = Number(id);

  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(SortDirection.ASC);
  const [limit, setLimit] = useState<number | undefined>(5);
  const [offset, setOffset] = useState<number | undefined>(0);

  const {
    data,
    isSuccess,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/versions', projectId, sortField, sortDirection, limit, offset],
    queryFn: () => versionsService.getVersions({
      sortField,
      sortDirection,
      limit,
      offset,
      projectId,
    }),
  });

  if (!isSuccess || isLoading || error) {
    return null;
  }

  const columns: TableColumn<VersionWithIssues>[] = [
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
      field: 'isArchived',
      header: 'Is Archived',
      type: 'string',
      sortable: true,
    },
    {
      field: 'startDate',
      type: 'date',
      header: 'Start date',
      sortable: true,
    },
    {
      field: 'releaseDate',
      type: 'date',
      header: 'Release date',
      sortable: true,
    },
  ];

  const onStateChange = (filed: string, direction?: SortDirection, limitState?: number, offsetState?: number) => {
    setSortField(filed);
    setSortDirection(direction);
    setLimit(limitState);
    setOffset(offsetState);
  };

  const rowExpansionTemplate = (item: VersionWithIssues) => {
    const issuesColumns: TableColumn<IssueWithTypeAndStatus>[] = [
      { field: 'id', header: 'Id', type: 'numeric' },
      { field: 'summary', header: 'Summary', type: 'string' },
      { field: 'key', header: 'Key', type: 'string' },
      { field: 'type', header: 'Type', type: 'string' },
      { field: 'status', header: 'Status', type: 'string' },
      { field: 'description', header: 'Description', type: 'string' },
      { field: 'hoursEstimated', header: 'Estimated', template: (hours) => `${hours}h` },
      { field: 'startDate', header: 'Start date', type: 'date' },
      { field: 'dueDate', header: 'Due date', type: 'date' },
    ];

    return <Table size="small" items={item.issues} columns={issuesColumns} paginate={false} />;
  };

  return (
    <Table
      size="normal"
      items={data.items}
      limit={limit}
      offset={offset}
      totalRecords={data.count}
      onStateChange={onStateChange}
      columns={columns}
      defaultSortField={sortField}
      defaultSortOrder={sortDirection}
      limitStep={5}
      rowExpansionTemplate={rowExpansionTemplate}
    />
  );
}
