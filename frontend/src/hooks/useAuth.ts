import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { User } from '@/types';

export function useAuth(): { user: User | null };
export function useAuth(redirect: string): { user: User };
export function useAuth(redirect?: string) {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  if (!user && redirect) {
    return router.push(redirect);
  }

  return { user };
}
