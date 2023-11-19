import { inject, injectable } from 'inversify';

import { EmployeeRole } from '../types';

import { BaseRepository, DatabaseClient } from '@modules/core';

@injectable()
export class EmployeeRolesRepository extends BaseRepository<EmployeeRole> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('employee_role', databaseClient);
  }
}
