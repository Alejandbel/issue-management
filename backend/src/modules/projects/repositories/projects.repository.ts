import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient } from '@modules/core';

import { Project } from '../types';

@injectable()
export class ProjectsRepository extends BaseRepository<Project> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('project', databaseClient);
  }
}
