import { ContainerModule } from 'inversify';

import { UsersRepository } from './repositories';

export const usersModule = new ContainerModule((bind) => {
  bind(UsersRepository).toSelf();
});
