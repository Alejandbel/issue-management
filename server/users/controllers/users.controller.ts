import { User } from '@server/users/types';
import { inject, injectable } from 'inversify';

import { UsersService } from '../services';

@injectable()
export class UsersController {
  @inject(UsersService) private readonly usersService: UsersService;

  async getUsersList(): Promise<User[]> {
    return this.usersService.find();
  }
}
