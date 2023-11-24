import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';

import { ProjectsRepository } from '../repositories';
import { Project } from '../types';

@injectable()
export class ProjectsService {
  @inject(ProjectsRepository) private readonly employeeRolesRepository: ProjectsRepository;

  async find(options?: Partial<Project>): Promise<Project[]> {
    return this.employeeRolesRepository.find(options);
  }

  async findOneOrFail(options: Partial<Project>): Promise<Project> {
    const project = await this.employeeRolesRepository.findOne(options);

    if (!project) {
      throw new EntityNotFoundError('Project');
    }

    return project;
  }
}
