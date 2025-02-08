import { User } from '@prisma/client';

export interface ApiResponse<T> {
  data?: T;
  message: string;
  error?: any;
  statusCode: number;
}

export type ApiSuccessResponse<T> = Omit<ApiResponse<T>, 'error'>;

export type ApiErrorResponse<T> = Omit<ApiResponse<T>, 'data'>;

export type AuthResponse = null;

export type { User };
