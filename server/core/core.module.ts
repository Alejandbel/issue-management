import { AsyncContainerModule } from 'inversify';

import { ConfigService } from './config';
import { DatabaseClient } from './database';
import { ValidationService } from './services';

export const coreModule = new AsyncContainerModule(async (bind) => {
  bind<ConfigService>(ConfigService).toSelf();
  bind<DatabaseClient>(DatabaseClient).toSelf();
  bind<ValidationService>(ValidationService).toSelf();
});
