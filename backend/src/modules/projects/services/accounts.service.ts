import { inject, injectable } from 'inversify';

import { EntityNotFoundError, ServiceError } from '@modules/core';

import { AccountsRepository } from '../repositories';
import { Account, AccountsListOptions, AccountToUpdate } from '../types';

@injectable()
export class AccountsService {
  @inject(AccountsRepository) private readonly accountsRepository: AccountsRepository;

  async findWithCount(options: AccountsListOptions): Promise<[Account[], number]> {
    return this.accountsRepository.findWithCount({}, options);
  }

  async findOne(options: Partial<Account>): Promise<Account | undefined> {
    return this.accountsRepository.findOne(options);
  }

  async updateOne(id: number, account: AccountToUpdate): Promise<void> {
    await this.findOneOrFail({ id });

    if (account.key) {
      await this.validateKeyForUniqueness(account.key, id);
    }

    await this.accountsRepository.updateById(id, account);
  }

  async create(account: Pick<Account, 'title' | 'key'>): Promise<number> {
    await this.validateKeyForUniqueness(account.key);
    return this.accountsRepository.create(account);
  }

  private async validateKeyForUniqueness(key: string, originalId?: number): Promise<void> {
    const account = await this.findOne({
      key,
    });
    if (account && account.id !== originalId) {
      throw new ServiceError(`Account with key ${key} already exists`);
    }
  }

  async findOneOrFail(options: Partial<Account>): Promise<Account> {
    const account = await this.accountsRepository.findOne(options);

    if (!account) {
      throw new EntityNotFoundError('Account');
    }

    return account;
  }
}
