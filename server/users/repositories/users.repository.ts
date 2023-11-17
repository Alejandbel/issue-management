import { DatabaseClient } from '@server/core';
import { inject, injectable } from 'inversify';

@injectable()
export class UsersRepository {
  constructor(@inject(DatabaseClient) private readonly databaseClient: DatabaseClient) {
  }
}
