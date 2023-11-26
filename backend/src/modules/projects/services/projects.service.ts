import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';
import { DepartmentsService } from '@modules/departments';
import { UsersService } from '@modules/users';

import { ProjectsRepository } from '../repositories';
import { Project, ProjectListOptions, ProjectToCreate, ProjectToUpdate } from '../types';

import { AccountsService } from './accounts.service';

@injectable()
export class ProjectsService {
  @inject(ProjectsRepository) private readonly projectsRepository: ProjectsRepository;
  @inject(AccountsService) private readonly accountsService: AccountsService;
  @inject(DepartmentsService) private readonly departmentsService: DepartmentsService;
  @inject(UsersService) private readonly usersService: UsersService;

  async findWithCount(options: ProjectListOptions): Promise<[Project[], number]> {
    return Promise.all([
      this.projectsRepository.findWithRelations(
        {
          accountId: options.accountId,
          departmentId: options.departmentId,
        },
        options,
      ),
      this.projectsRepository.count({
        accountId: options.accountId,
        departmentId: options.departmentId,
      }),
    ]);
  }

  async updateOne(id: number, projectToUpdate: ProjectToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.validateProjectFields(projectToUpdate);

    await this.projectsRepository.updateById(id, projectToUpdate);
  }

  async create(projectToCreate: ProjectToCreate): Promise<number> {
    await this.validateProjectFields(projectToCreate);
    return this.projectsRepository.create(projectToCreate);
  }

  private async validateProjectFields(projectToUpdate: ProjectToUpdate): Promise<void> {
    projectToUpdate.accountId && (await this.accountsService.findOneOrFail({ id: projectToUpdate.accountId }));
    projectToUpdate.departmentId && (await this.departmentsService.findOneOrFail({ id: projectToUpdate.departmentId }));
    projectToUpdate.leadId && (await this.usersService.findOneOrFail({ id: projectToUpdate.leadId }));
  }

  async findOneOrFail(options: Partial<Project>): Promise<Project> {
    const project = await this.projectsRepository.findOne(options);

    if (!project) {
      throw new EntityNotFoundError('Project');
    }

    return project;
  }
}
