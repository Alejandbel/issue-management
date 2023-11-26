import { inject, injectable } from 'inversify';

import { DatabaseClient, BaseRepository } from '@modules/core';

import { Version } from '../types';

@injectable()
export class VersionsRepository extends BaseRepository<Version> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('version', databaseClient);
  }
}
