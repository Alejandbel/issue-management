import { authModule } from '@server/auth';
import { coreModule } from '@server/core';
import { usersModule } from '@server/users';
import { Container, interfaces } from 'inversify';

const modules = [usersModule, coreModule, authModule];
let isInitialized = false;
const serverContainer = new Container();

async function getInitializedServer(): Promise<Container> {
  if (isInitialized) {
    console.log('INITIALIZED');

    return serverContainer;
  }

  console.log('INITIALIZING');

  for (const containerModule of modules) {
    await serverContainer.loadAsync(containerModule);
  }

  isInitialized = true;

  return serverContainer;
}

export async function getController<T>(identifier: interfaces.ServiceIdentifier<T>): Promise<T> {
  const container = await getInitializedServer();

  return container.getAsync(identifier);
}
