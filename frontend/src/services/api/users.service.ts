import axios from './axios';
import { SortDirection, User } from '@/types';

export const usersService = {
  getUsers: async (params: { sortField?: string, sortDirection?: SortDirection }, cookie?: string): Promise<{ items: Omit<User, 'password'>[] }> => {
    const { data } = await axios.get('/users', {
      params,
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    return data;
  },

  updateUser: async (id: number, user: Pick<User, 'endWorksAt' | 'startWorksAt'>) => {
    await axios.patch(`/users/${id}`, user);
  },
};
