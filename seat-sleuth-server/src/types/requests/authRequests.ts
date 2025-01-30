import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).regex(/\d/, { message: 'Password must contain at least one number' }),
});

export type AuthRequest = z.infer<typeof AuthSchema>;
