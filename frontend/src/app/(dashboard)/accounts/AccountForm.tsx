import { InputText } from 'primereact/inputtext';
import React from 'react';

import { Account } from '@/types';

type AccountFormProps = {
  defaultAccount?: Account;
};

export function AccountForm({ defaultAccount }: AccountFormProps) {
  return (
    <>
      <input hidden name="id" value={defaultAccount?.id} readOnly />
      <label htmlFor="title" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="title" defaultValue={defaultAccount?.title} name="title" className="w-full mb-3" required />

      <label htmlFor="key" className="block text-900 font-medium mb-2">Key</label>
      <InputText id="key" defaultValue={defaultAccount?.key} name="key" required />
    </>
  );
}
