import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Role, UserWithRole } from '@/types';

export function useAuth(): { user: UserWithRole | null };
export function useAuth(redirect: string, allowedRoles?: Role[]): { user: UserWithRole };
export function useAuth(redirect?: string, allowedRoles?: Role[]) {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  if (redirect && (!user || (allowedRoles && !allowedRoles.includes(user.role)))) {
    return router.push(redirect);
  }

  return { user };
}
