import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPatch,
  httpPost,
  IHttpActionResult,
  queryParam,
  requestBody,
  requestParam,
} from 'inversify-express-utils';

import { AuthorizedMiddleware, roles } from '@modules/auth/middlewares';
import {
  applyBodyValidation,
  applyParamsValidation,
  applyQueryValidation,
  idParamsSchema,
  ParamsId,
} from '@modules/core';
import { EMPLOYEE_ROLE } from '@modules/users';

import { createAccountBodySchema, getAccountsListQuerySchema, updateAccountBodySchema } from '../schemas';
import { AccountsService } from '../services';
import { AccountsListOptions, AccountToUpdate } from '../types';

@controller('/accounts')
export class AccountsController extends BaseHttpController {
  @inject(AccountsService) private readonly accountsService: AccountsService;

  @httpGet('/', AuthorizedMiddleware, applyQueryValidation(getAccountsListQuerySchema))
  async getAccountsList(@queryParam() query: AccountsListOptions): Promise<IHttpActionResult> {
    const [items, count] = await this.accountsService.findWithCount(query);
    return this.json({ items, count });
  }

  @httpPost(
    '/',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.SALES, EMPLOYEE_ROLE.ADMIN]),
    applyBodyValidation(createAccountBodySchema),
  )
  async createAccount(@requestBody() account: AccountToUpdate): Promise<IHttpActionResult> {
    await this.accountsService.create(account);
    return this.ok();
  }

  @httpPatch(
    '/:id',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.SALES, EMPLOYEE_ROLE.ADMIN]),
    applyParamsValidation(idParamsSchema),
    applyBodyValidation(updateAccountBodySchema),
  )
  async updateAccount(
    @requestParam() { id }: ParamsId,
    @requestBody() account: Required<AccountToUpdate>,
  ): Promise<IHttpActionResult> {
    await this.accountsService.updateOne(id, account);
    return this.ok();
  }
}
