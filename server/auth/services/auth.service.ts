import { ServiceError } from '@server/core';
import { UsersService } from '@server/users';
import { inject, injectable } from 'inversify';

import { SignUpUser } from '../types';

@injectable()
export class AuthService {
  @inject(UsersService) private readonly usersService: UsersService;

  async signUp(user: SignUpUser) {
    const dbUser = await this.usersService.findOne({ email: user.email });

    if (dbUser) {
      throw new ServiceError('User already exists');
    }

    const userId = await this.usersService.create(user);

    console.log(userId);
  }
}
