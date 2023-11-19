import axios from './axios';

export const authService = {
  signUp: async (data: { name: string, password: string, email: string }) => {
    await axios.post('/auth/sign-up', data);
  },
};
