export type HttpMethodsAllowed = 'GET' | 'POST' | 'DELETE' | 'PUT';

export interface ApiEndpoint {
  route: string;
  method: HttpMethodsAllowed;
}

export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
  HEALTH: { route: '/health', method: 'GET' },
  AUTH_LOGIN: { route: '/auth/login', method: 'POST' },
  AUTH_REGISTER: { route: '/auth/register', method: 'POST' },
} as const;
