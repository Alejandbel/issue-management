import { inject, injectable } from 'inversify';

import { ProjectsRepository } from '../repositories';
import { Project } from '../types';

import { EntityNotFoundError } from '@modules/core';

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
