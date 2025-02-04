import { User } from '@prisma/client';

export interface ApiResponse<T> {
  data?: T;
  message: string;
  error?: any;
  statusCode: number;
}

export type ApiSuccessResponse<T> = Omit<ApiResponse<T>, 'error'>;

export type ApiErrorResponse<T> = Omit<ApiResponse<T>, 'data'>;

export type RegistrationResponse = Omit<User, 'password'>;

export interface LoginResponse {
  token: string;
}

export { User };
