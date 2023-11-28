'use client';

import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';

import { useAuth } from '@/hooks';

export function Header() {
  const router = useRouter();
  const { user } = useAuth('/sign-in');

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => router.push('/'),
    },
    ...(user.role === 'admin' ? [{
      label: 'Users',
      command: () => router.push('/users'),
    }] : []),
    {
      label: 'Accounts',
      command: () => router.push('/accounts'),
    },
    {
      label: 'Departments',
      command: () => router.push('/departments'),
    },
    {
      label: 'Projects',
      command: () => router.push('/projects'),
    },
    ...(['admin', 'sales'].includes(user.role) ? [{
      label: 'Salaries',
      command: () => router.push('/salaries'),
    }] : []),
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-user',
      command: () => router.push('/logout'),
    },
  ];

  return (
    <div>
      <TabMenu model={items} />
    </div>
  );
}
