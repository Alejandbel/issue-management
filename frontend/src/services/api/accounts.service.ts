import axios from './axios';
import { Account, SortDirection } from '@/types';

export const accountsService = {
  getAccounts: async (params: {
    sortField?: string,
    sortDirection?: SortDirection,
    limit?: number,
    offset?: number
  } = {}, cookie?: string): Promise<{ items: Account[], count: number }> => {
    const { data } = await axios.get('/accounts', {
      params,
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    return data;
  },

  createAccount: async (account: Pick<Account, 'key' | 'title'>) => {
    await axios.post('/accounts', account);
  },

  updateAccount: async (id: number, account: Pick<Account, 'key' | 'title'>) => {
    await axios.patch(`/accounts/${id}`, account);
  },
};
