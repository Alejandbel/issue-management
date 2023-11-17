import { injectable } from 'inversify';
import { z } from 'zod';

@injectable()
export class ValidationService {
  validateFormData<T>(schema: z.Schema<T>, payload: FormData): T {
    const object = Object.fromEntries(payload);

    console.log(payload, object);

    return schema.parse(object);
  }
}
