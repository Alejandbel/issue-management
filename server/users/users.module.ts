import { ContainerModule } from 'inversify';

import { UsersController } from './controllers';
import { UsersRepository } from './repositories';
import { UsersService } from './services';

export const usersModule = new ContainerModule((bind) => {
  bind(UsersService).toSelf();
  bind(UsersRepository).toSelf();
  bind(UsersController).toSelf();
});
