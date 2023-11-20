import { inject, injectable } from 'inversify';

import { Project } from '../types';

import { BaseRepository, DatabaseClient } from '@modules/core';

@injectable()
export class ProjectsRepository extends BaseRepository<Project> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('project', databaseClient);
  }
}
