import { cookies } from 'next/headers';

import { UsersTable } from './UsersTable';
import { usersService } from '@/services/api';

export default async function Page() {
  const users = await usersService.getUsers({}, cookies()
    .toString());

  return (
    <div className="card">
      <UsersTable defaultUsers={users} />
    </div>
  );
}
