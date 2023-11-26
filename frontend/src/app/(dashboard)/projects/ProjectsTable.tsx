'use client';

import { useQuery } from '@tanstack/react-query';
import React, { FormEvent, useState } from 'react';
import { z } from 'zod';

import { ProjectForm } from './ProjectForm';
import { Table, TableColumn } from '@/components/Table';
import { projectsService } from '@/services/api';
import { Project, ProjectWithRelations, SortDirection } from '@/types';
import { validateForm } from '@/utils';

export const projectBodySchema = z
  .object({
    id: z.preprocess(Number, z.number()).optional(),
    name: z.string().max(255),
    key: z.string().max(16),
    departmentId: z.coerce.number(),
    accountId: z.coerce.number(),
    leadId: z.optional(z.coerce.number()),
  })
  .strip();

export function ProjectsTable() {
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
    queryKey: ['/projects', sortField, sortDirection, limit, offset],
    queryFn: () => projectsService.getProjects({
      sortField,
      sortDirection,
      limit,
      offset,
    }),
  });

  if (!isSuccess || isLoading || error) {
    return null;
  }

  const columns: TableColumn<ProjectWithRelations>[] = [
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
      field: 'key',
      header: 'Key',
      type: 'string',
      sortable: true,
    },
    {
      field: 'lead',
      header: 'Lead',
      type: 'string',
    },
    {
      field: 'account',
      header: 'Account',
      type: 'string',
    },
    {
      field: 'department',
      header: 'Department',
      type: 'string',
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

    const project = validateForm(event.currentTarget, projectBodySchema);

    if (project.id) {
      await projectsService.updateProject(project.id, project);
    } else {
      await projectsService.createProject(project);
    }

    await refetch();
  };

  const form = (project?: Project) => <ProjectForm defaultProject={project} />;

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
