'use client';

import { UsersTable } from './UsersTable';
import { useAuth } from '@/hooks';

export default function Page() {
  useAuth('/', ['admin']);

  return (
    <div className="card">
      <UsersTable />
    </div>
  );
}
