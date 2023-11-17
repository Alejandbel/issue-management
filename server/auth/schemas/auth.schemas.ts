import { z } from 'zod';

export const signUpValidationSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
}).strip();
