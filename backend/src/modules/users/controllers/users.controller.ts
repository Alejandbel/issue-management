import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPatch,
  IHttpActionResult,
  queryParam,
  requestBody,
  requestParam,
} from 'inversify-express-utils';

import { getUsersListQuerySchema, updateUserBodySchema } from '../schemas';
import { UsersService } from '../services';
import { UsersListOptions, UserToUpdate } from '../types';

import { AuthorizedMiddleware } from '@modules/auth/middlewares';
import {
  applyBodyValidation,
  applyParamsValidation,
  applyQueryValidation,
  idParamsSchema,
  ParamsId,
} from '@modules/core';

@controller('/users')
export class UsersController extends BaseHttpController {
  @inject(UsersService) private readonly usersService: UsersService;

  @httpGet('/', AuthorizedMiddleware, applyQueryValidation(getUsersListQuerySchema))
  async getUsersList(@queryParam() query: UsersListOptions): Promise<IHttpActionResult> {
    const users = await this.usersService.find(query);
    return this.json({ items: users });
  }

  @httpPatch('/:id', applyParamsValidation(idParamsSchema), applyBodyValidation(updateUserBodySchema))
  async updateUser(@requestParam() { id }: ParamsId, @requestBody() user: UserToUpdate): Promise<IHttpActionResult> {
    await this.usersService.updateOne(id, user);
    return this.ok();
  }
}
