import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, requestBody } from 'inversify-express-utils';

import { ACCESS_TOKEN_COOKIE } from '../contants';
import { signUpBodySchema } from '../schemas';
import { AuthService } from '../services';
import { SignUpUser } from '../types';

import { applyBodyValidation } from '@modules/core';

@controller('/auth')
export class AuthController extends BaseHttpController {
  @inject(AuthService) private readonly authService: AuthService;

  @httpPost('/sign-up', applyBodyValidation(signUpBodySchema))
  async signUp(@requestBody() body: SignUpUser): Promise<void> {
    const accessToken = await this.authService.signUp(body);
    this.setCookie(ACCESS_TOKEN_COOKIE, accessToken);
  }

  private setCookie(name: string, value: string): void {
    this.httpContext.response.cookie(name, value, { secure: true });
  }
}
