import { useQuery } from '@tanstack/react-query';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { accountsService, departmentsService, usersService } from '@/services/api';
import { Project } from '@/types/projects.types';

type ProjectFormProps = {
  defaultProject?: Project;
};

function useProjectForm() {
  const { data: departments, isSuccess: isDepartmentsSuccess, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['/departments'],
    queryFn: () => departmentsService.getDepartments(),
  });

  const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useQuery({
    queryKey: ['/users'],
    queryFn: () => usersService.getUsers(),
  });

  const { data: accounts, isSuccess: isAccountsSuccess, isLoading: isAccountsLoading } = useQuery({
    queryKey: ['/accounts'],
    queryFn: () => accountsService.getAccounts(),
  });

  return {
    departments,
    users,
    accounts,
    isLoading: isDepartmentsLoading || isAccountsLoading || isUsersLoading,
    isSuccess: isDepartmentsSuccess && isAccountsSuccess && isUsersSuccess,
  };
}

export function ProjectForm({ defaultProject }: ProjectFormProps) {
  const {
    departments, users, accounts, isLoading, isSuccess,
  } = useProjectForm();

  const [leadId, setLeadId] = useState(defaultProject?.leadId);
  const [departmentId, setDepartmentId] = useState(defaultProject?.departmentId);
  const [accountId, setAccountId] = useState(defaultProject?.accountId);

  if (!isSuccess || isLoading) {
    return null;
  }

  return (
    <>
      <input hidden name="id" value={defaultProject?.id} readOnly />

      <label htmlFor="name" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="name" defaultValue={defaultProject?.name} name="name" className="w-full mb-3" required />

      <label htmlFor="key" className="block text-900 font-medium mb-2">Key</label>
      <InputText id="key" defaultValue={defaultProject?.key} name="key" required />

      <label htmlFor="leadId" className="block text-900 font-medium mb-2">Lead</label>
      <Dropdown
        value={leadId}
        onChange={(e) => setLeadId(e.value)}
        options={users!.items}
        name="leadId"
        id="leadId"
        optionValue="id"
        optionLabel="name"
        className="w-full mb-3"
      />

      <label htmlFor="accountId" className="block text-900 font-medium mb-2">Account</label>
      <Dropdown
        value={accountId}
        onChange={(e) => setAccountId(e.value)}
        options={accounts!.items}
        name="accountId"
        id="accountId"
        optionValue="id"
        optionLabel="title"
        className="w-full mb-3"
      />

      <label htmlFor="departmentId" className="block text-900 font-medium mb-2">Department</label>
      <Dropdown
        value={departmentId}
        onChange={(e) => setDepartmentId(e.value)}
        options={departments!.items}
        id="departmentId"
        name="departmentId"
        optionValue="id"
        optionLabel="title"
        className="w-full mb-3"
      />
    </>
  );
}
