'use client';

import { useRouter } from 'next/navigation';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

export function Header() {
  const router = useRouter();

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => router.push('/'),
    },
    {
      label: 'About',
      icon: 'pi pi-fw pi-info',
      command: () => router.push('/about'),
    },
    {
      label: 'Sign in',
      icon: 'pi pi-fw pi-user',
      command: () => router.push('/sign-in'),
    },
    {
      label: 'Contact',
      icon: 'pi pi-fw pi-envelope',
      command: () => router.push('/contact'),
    },
  ];

  return (
    <div>
      <Menubar className="m-2" model={items} />
    </div>
  );
}
