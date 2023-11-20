import { InputText } from 'primereact/inputtext';
import React from 'react';

export function CreateAccountForm() {
  return (
    <>
      <label htmlFor="title" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="title" name="title" className="w-full mb-3" required />

      <label htmlFor="key" className="block text-900 font-medium mb-2">Key</label>
      <InputText id="key" name="key" required />
    </>
  );
}
