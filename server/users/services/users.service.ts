import { inject, injectable } from 'inversify';

import { UsersRepository } from '../repositories';

@injectable()
export class UsersService {
  @inject(UsersRepository) private readonly usersRepository: UsersRepository;
}
