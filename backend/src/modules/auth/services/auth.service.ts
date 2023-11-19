import { inject, injectable } from 'inversify';

import { SignUpUser } from '../types';

import { JwtService } from './jwt.service';

import { ServiceError } from '@modules/core';
import { UsersService } from '@modules/users';

@injectable()
export class AuthService {
  @inject(UsersService) private readonly usersService: UsersService;
  @inject(JwtService) private readonly jwtService: JwtService;

  async signUp(user: SignUpUser): Promise<string> {
    const dbUser = await this.usersService.findOne({ email: user.email });
    if (dbUser) {
      throw new ServiceError('User already exists');
    }

    const userId = await this.usersService.create(user);
    return this.generateTokenForUser(userId);
  }

  private async generateTokenForUser(userId: number): Promise<string> {
    const userWithRole = await this.usersService.findOneWithRoleOrFail({ id: userId });
    return this.jwtService.generateAccessToken(userWithRole);
  }
}
