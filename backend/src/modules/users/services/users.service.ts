import { inject, injectable } from 'inversify';

import { UsersRepository } from '../repositories';
import { User, UsersListOptions, UserToUpdate, UserWithRole } from '../types';

import { EntityNotFoundError } from '@modules/core';

@injectable()
export class UsersService {
  @inject(UsersRepository) private readonly usersRepository: UsersRepository;

  async findWithCount(options: UsersListOptions): Promise<[User[], number]> {
    return this.usersRepository.findWithCount({}, options);
  }

  async findOne(options: Partial<User>): Promise<User | undefined> {
    return this.usersRepository.findOne(options);
  }

  async findOneWithRoleOrFail(options: Partial<User>): Promise<UserWithRole> {
    const user = await this.usersRepository.findOneWithRole(options);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    return user;
  }

  async updateOne(id: number, user: UserToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.usersRepository.updateById(id, user);
  }

  async create(user: Pick<User, 'email' | 'password' | 'name'>): Promise<number> {
    const userId = await this.usersRepository.create(user);

    return userId;
  }

  async findOneOrFail(options: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    return user;
  }
}
