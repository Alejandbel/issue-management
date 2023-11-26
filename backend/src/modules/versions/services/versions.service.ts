import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';

import { VersionsRepository } from '../repositories';
import { Version, VersionListOptions, VersionToUpdate } from '../types';

@injectable()
export class VersionsService {
  @inject(VersionsRepository) private readonly departmentsRepository: VersionsRepository;

  async findWithCount(options: VersionListOptions): Promise<[Version[], number]> {
    return this.departmentsRepository.findWithCount({}, options);
  }

  async updateOne(id: number, departmentToUpdate: VersionToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.departmentsRepository.updateById(id, departmentToUpdate);
  }

  async deleteOne(id: number): Promise<void> {
    await this.findOneOrFail({ id });
    await this.departmentsRepository.deleteById(id);
  }

  async create(department: Pick<Version, 'title'>): Promise<number> {
    return this.departmentsRepository.create(department);
  }

  async findOneOrFail(options: Partial<Version>): Promise<Version> {
    const department = await this.departmentsRepository.findOne(options);

    if (!department) {
      throw new EntityNotFoundError('Department');
    }

    return department;
  }
}
