import { Container } from 'inversify';

import { authModule } from '@modules/auth';
import { coreModule, DatabaseClient } from '@modules/core';
import { projectsModule } from '@modules/projects';
import { usersModule } from '@modules/users';

export async function initializeContainer(): Promise<Container> {
  const modules = [projectsModule, usersModule, coreModule, authModule];
  const serverContainer = new Container();

  for (const containerModule of modules) {
    await serverContainer.loadAsync(containerModule);
  }

  const db = serverContainer.get(DatabaseClient);
  await db.connect();
  await db.migrate();

  return serverContainer;
}
