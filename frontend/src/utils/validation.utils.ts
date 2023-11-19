import { Schema } from 'zod';

export function validateForm<T>(form: HTMLFormElement, schema: Schema<T>): T {
  const formData = new FormData(form);

  return schema.parse(Object.fromEntries(formData));
}
