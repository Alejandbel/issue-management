import { getController, UsersController } from '@server';

import { UsersTable } from './UsersTable';

export default async function Page() {
  const usersController = await getController(UsersController);
  const users = await usersController.getUsersList();

  return (
    <div className="card">
      <UsersTable users={users} />
    </div>
  );
}
