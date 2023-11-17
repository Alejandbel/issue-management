import 'reflect-metadata';
import { coreModule } from '@server/core';
import { usersModule } from '@server/users';
import { UsersController } from '@server/users/controllers';
import { Container, ContainerModule } from 'inversify';

const modules = [usersModule, coreModule];
export const serverContainer = new Container({ defaultScope: 'Singleton' });

export async function initializeServer(): Promise<void> {
  for (const containerModule of modules) {
    if (containerModule instanceof ContainerModule) {
      serverContainer.load(containerModule);
    } else {
      await serverContainer.loadAsync(containerModule);
    }
  }

  console.log(await serverContainer.getAsync(UsersController));
}
