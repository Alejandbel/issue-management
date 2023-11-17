import { User } from '@server/users/types';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable value={users} stripedRows tableStyle={{ minWidth: '50rem' }}>
      <Column field="name" header="Name" />
      <Column field="email" header="Email" />
      <Column field="startWorksAt" header="Start works at" />
      <Column field="endWorksAt" header="End works at" />
      <Column field="roleId" header="Role" />
    </DataTable>
  );
}
