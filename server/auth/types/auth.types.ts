import { z } from 'zod';

import { signUpValidationSchema } from '../schemas';

export type SignUpUser = z.infer<typeof signUpValidationSchema>;
