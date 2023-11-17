import { DatabaseClient, BaseRepository } from '@server/core';
import { inject, injectable } from 'inversify';

import { User } from '../types';

@injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('user', databaseClient);
  }
}
