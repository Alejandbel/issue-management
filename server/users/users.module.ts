import { AsyncContainerModule } from 'inversify';

import { UsersController } from './controllers';
import { UsersRepository } from './repositories';
import { UsersService } from './services';

export const usersModule = new AsyncContainerModule(async (bind) => {
  bind(UsersService).toSelf();
  bind(UsersRepository).toSelf();
  bind(UsersController).toSelf();
});
