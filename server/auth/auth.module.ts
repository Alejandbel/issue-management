import { AsyncContainerModule } from 'inversify';

import { AuthController } from './controllers';
import { AuthService } from './services';

export const authModule = new AsyncContainerModule(async (bind) => {
  bind(AuthController).toSelf();
  bind(AuthService).toSelf();
});
