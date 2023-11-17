import { getController } from '@server';
import { AuthController } from '@server/auth';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';

async function signUp(formData: FormData) {
  'use server';

  const authController = await getController(AuthController);

  await authController.signUp(formData);
}

export default function SignInPage() {
  return (
    <div className="flex align-items-center h-full justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
        </div>

        <form action={signUp}>
          <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
          <InputText id="email" name="email" type="text" placeholder="Email address" className="w-full mb-3" />

          <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
          <InputText id="name" name="name" type="text" placeholder="Name" className="w-full mb-3" />

          <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
          <InputText id="password" name="password" type="password" placeholder="Password" className="w-full mb-3" />

          <Button type="submit" label="Sign Up" icon="pi pi-user" className="w-full" />
        </form>
      </div>
    </div>
  );
}
