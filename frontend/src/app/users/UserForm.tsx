import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import React from 'react';

import { User } from '@/types';

type UserFormProps = {
  defaultUser?: Omit<User, 'password'>;
};

export function UserForm({ defaultUser }: UserFormProps) {
  return (
    <>
      <input hidden name="id" value={defaultUser?.id} readOnly />

      <label htmlFor="name" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="name" value={defaultUser?.name} name="name" className="w-full mb-3" required />

      <label htmlFor="key" className="block text-900 font-medium mb-2">Key</label>
      <InputText id="key" value={defaultUser?.email} name="key" required />

      <label htmlFor="startWorksAt" className="block text-900 font-medium mb-2">Start works at</label>
      <Calendar id="startWorksAt" placeholder={defaultUser?.startWorksAt?.toString()} value={defaultUser?.startWorksAt} name="startWorksAt" className="w-full mb-3" required />

      <label htmlFor="endWorksAt" className="block text-900 font-medium mb-2">End works at</label>
      <Calendar id="endWorksAt" placeholder={defaultUser?.endWorksAt?.toString()} value={defaultUser?.endWorksAt} name="endWorksAt" className="w-full mb-3" required />
    </>
  );
}
