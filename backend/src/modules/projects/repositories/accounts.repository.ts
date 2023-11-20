import { inject, injectable } from 'inversify';

import { Account } from '../types';

import { DatabaseClient, BaseRepository } from '@modules/core';

@injectable()
export class AccountsRepository extends BaseRepository<Account> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('account', databaseClient);
  }
}
