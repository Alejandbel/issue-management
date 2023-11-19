import { inject, injectable } from 'inversify';

import { EmployeeRolesRepository } from '../repositories';
import { EmployeeRole } from '../types';

import { EntityNotFoundError } from '@modules/core';

@injectable()
export class EmployeeRolesService {
  @inject(EmployeeRolesRepository) private readonly employeeRolesRepository: EmployeeRolesRepository;

  async find(options?: Partial<EmployeeRole>): Promise<EmployeeRole[]> {
    return this.employeeRolesRepository.find(options);
  }

  async findOneOrFail(options: Partial<EmployeeRole>): Promise<EmployeeRole> {
    const employeeRole = await this.employeeRolesRepository.findOne(options);

    if (!employeeRole) {
      throw new EntityNotFoundError('EmployeeRole');
    }

    return employeeRole;
  }
}
