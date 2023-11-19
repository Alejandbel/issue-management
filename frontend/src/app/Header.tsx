'use client';

import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';

export function Header() {
  const router = useRouter();

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => router.push('/'),
    },
    {
      label: 'Sign in',
      icon: 'pi pi-fw pi-user',
      command: () => router.push('/sign-in'),
    },
    {
      label: 'Sign up',
      icon: 'pi pi-fw pi-user',
      command: () => router.push('/sign-up'),
    },
  ];

  return (
    <div>
      <TabMenu model={items} />
    </div>
  );
}
