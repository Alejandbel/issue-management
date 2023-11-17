import { EntityNotFoundError } from '@server/core/errors';
import { User } from '@server/users/types';
import { inject, injectable } from 'inversify';

import { UsersRepository } from '../repositories';

@injectable()
export class UsersService {
  @inject(UsersRepository) private readonly usersRepository: UsersRepository;

  findOne(options: Partial<User>) {
    return this.usersRepository.findOne(options);
  }

  async create(user: Pick<User, 'email' | 'password' | 'name'>): Promise<number> {
    const userId = await this.usersRepository.create(user);

    return userId;
  }

  findOneOrFail(options: Partial<User>) {
    const user = this.usersRepository.findOne(options);

    if (!user) {
      throw new EntityNotFoundError('U');
    }
  }
}
