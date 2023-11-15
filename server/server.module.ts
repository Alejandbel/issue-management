import 'reflect-metadata';
import { coreModule } from '@server/core';
import { usersModule } from '@server/users';
import { Container, ContainerModule } from 'inversify';

const modules = [usersModule, coreModule];
const serverContainer = new Container();

export async function initializeServer(): Promise<void> {
  for (const containerModule of modules) {
    if (containerModule instanceof ContainerModule) {
      serverContainer.load(containerModule);
    } else {
      await serverContainer.loadAsync(containerModule);
    }
  }
}
