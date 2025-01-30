import { User } from '@prisma/client';

export interface ApiResponse<T> {
  data?: { type: string; payload: T };
  message: string;
  error?: any;
  statusCode: number;
}

export type RegistrationResponse = Omit<User, 'password'>;

export interface LoginResponse {
  token: string;
}

export { User };
