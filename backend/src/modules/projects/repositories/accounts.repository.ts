import { inject, injectable } from 'inversify';

import { DatabaseClient, BaseRepository } from '@modules/core';

import { Account } from '../types';

@injectable()
export class AccountsRepository extends BaseRepository<Account> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('account', databaseClient);
  }
}
