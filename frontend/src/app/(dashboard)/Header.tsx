'use client';

import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';

import { useAuth } from '@/hooks';

export function Header() {
  const router = useRouter();
  const { user } = useAuth();

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => router.push('/'),
    },
    {
      label: 'Users',
      command: () => router.push('/users'),
    },
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
    ...(user ? [
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-user',
        command: () => router.push('/logout'),
      },
    ]
      : []),
  ];

  return (
    <div>
      <TabMenu model={items} />
    </div>
  );
}
