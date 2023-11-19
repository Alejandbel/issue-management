import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { InFlightUser } from '../types';

import { ConfigService } from '@modules/core';

@injectable()
export class JwtService {
  @inject(ConfigService) private readonly configService: ConfigService;

  generateAccessToken(user: InFlightUser): string {
    return jwt.sign(
      {
        id: user.id,
        role: user.id,
      },
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      },
    );
  }

  validateAccessToken(accessToken: string): InFlightUser {
    return jwt.verify(accessToken, this.configService.get('JWT_SECRET')) as InFlightUser;
  }
}
