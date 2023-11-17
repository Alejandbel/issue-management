import { inject, injectable } from 'inversify';

import { UsersService } from '../services';

@injectable()
export class UsersController {
  @inject(UsersService) private readonly usersService: UsersService;
}
