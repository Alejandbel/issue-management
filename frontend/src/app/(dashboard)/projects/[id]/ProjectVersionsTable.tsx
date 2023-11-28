'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import React, { FormEvent, useState } from 'react';
import { z } from 'zod';

import { IssuesTable } from '@/app/(dashboard)/projects/[id]/IssuesTable';
import { VersionForm } from '@/app/(dashboard)/projects/[id]/VersionsForm';
import { Table, TableColumn } from '@/components/Table';
import { useAuth } from '@/hooks';
import { versionsService } from '@/services/api';
import { SortDirection, Version, VersionWithIssues } from '@/types';
import { validateForm } from '@/utils';

export const versionBodySchema = z
  .object({
    id: z.preprocess(Number, z.number()).optional(),
    title: z.string().max(255),
    projectId: z.coerce.number(),
    isArchived: z.coerce.boolean().default(false),
    startDate: z.coerce.date(),
    releaseDate: z.optional(z.coerce.date()),
  })
  .strip();

export function ProjectVersionsTable() {
  const { user } = useAuth('/sign-in');

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
    refetch,
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
      sortable: true,
      template: (val) => <Checkbox checked={Boolean(val)} readOnly />,
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

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const version = validateForm(event.currentTarget, versionBodySchema);

    if (version.id) {
      await versionsService.updateVersion(version.id, version);
    } else {
      await versionsService.createVersion(version);
    }

    await refetch();
  };

  const rowExpansionTemplate = (item: VersionWithIssues) => <IssuesTable issues={item.issues} refetch={refetch} versionId={item.id} />;

  const form = (version: Partial<Version> = {}) => <VersionForm defaultVersion={{ projectId, ...version }} />;

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
      dialogForm={form}
      onSave={onSave}
      actions={['admin', 'project_manager']?.includes(user.role) ? ['update', 'create'] : []}
      limitStep={5}
      rowExpansionTemplate={rowExpansionTemplate}
    />
  );
}
