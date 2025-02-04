import { AuthPayload } from './payloads';
import { LoginResponse, RegistrationResponse } from './responses';

export type HttpMethodsAllowed = 'GET' | 'POST' | 'DELETE' | 'PUT';

/**
 * Defines the valid API endpoints and their respective request payloads and responses.
 */
export const API_SCHEMA = {
  AUTH_LOGIN: {
    route: '/auth/login',
    method: 'POST',
    payload: {} as AuthPayload,
    response: {} as LoginResponse,
  },
  AUTH_REGISTER: {
    route: '/auth/register',
    method: 'POST',
    payload: {} as AuthPayload,
    response: {} as RegistrationResponse,
  },
} as const;

export type ValidServerEndpoints = keyof typeof API_SCHEMA;

export type EndpointPayload<E extends ValidServerEndpoints> = (typeof API_SCHEMA)[E]['payload'];

export type EndpointResponse<E extends ValidServerEndpoints> = (typeof API_SCHEMA)[E]['response'];
