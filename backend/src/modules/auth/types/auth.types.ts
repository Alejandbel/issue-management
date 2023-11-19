import { z } from 'zod';

import { signUpBodySchema } from '../schemas';

export type SignUpUser = z.infer<typeof signUpBodySchema>;
