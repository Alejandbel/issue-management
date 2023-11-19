import Link from 'next/link';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';

export default function SignInForm() {
  return (
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div className="text-center mb-5">
        <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
        <span className="text-600 font-medium line-height-3">Don&lsquo;t have an account?</span>
        <Link href="/sign-up" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          Create today!
        </Link>
      </div>

      <div>
        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
        <InputText id="email" type="text" placeholder="Email address" className="w-full mb-3" />

        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
        <InputText id="password" type="password" placeholder="Password" className="w-full mb-3" />

        <Button label="Sign In" icon="pi pi-user" className="w-full" />
      </div>
    </div>
  );
}
