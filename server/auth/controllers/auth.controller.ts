import { ValidationService } from '@server/core/services';
import { inject, injectable } from 'inversify';

import { signUpValidationSchema } from '../schemas';
import { AuthService } from '../services';

@injectable()
export class AuthController {
  @inject(AuthService) private readonly authService: AuthService;

  @inject(ValidationService) private readonly validationService: ValidationService;

  async signUp(formData: FormData) {
    const user = this.validationService.validateFormData(signUpValidationSchema, formData);

    await this.authService.signUp(user);
  }
}
