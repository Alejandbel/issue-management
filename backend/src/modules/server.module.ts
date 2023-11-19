import { Container } from 'inversify';

import { authModule } from '@modules/auth';
import { coreModule, DatabaseClient } from '@modules/core';
import { usersModule } from '@modules/users';

export async function initializeContainer(): Promise<Container> {
  const modules = [usersModule, coreModule, authModule];
  const serverContainer = new Container();

  for (const containerModule of modules) {
    await serverContainer.loadAsync(containerModule);
  }

  await serverContainer.get(DatabaseClient).connect();

  return serverContainer;
}