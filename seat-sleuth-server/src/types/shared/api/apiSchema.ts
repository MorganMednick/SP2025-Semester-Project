import { AuthPayload } from './payloads';
import { AuthResponse } from './responses';
import { TicketMasterResponse } from './ticketMasterResponse';

export type HttpMethodsAllowed = 'GET' | 'POST' | 'DELETE' | 'PUT';

/**
 * Defines the valid API endpoints and their respective request payloads and responses.
 */
export const API_SCHEMA = {
  HEALTH: {
    route: '/health',
    method: 'GET',
    payload: null,
    response: {} as any,
  },
  AUTH_LOGIN: {
    route: '/auth/login',
    method: 'POST',
    payload: {} as AuthPayload,
    response: null as AuthResponse,
  },
  CHECK_LOGIN: {
    route: '/auth/login',
    method: 'GET',
    payload: null,
    response: null as AuthResponse,
  },
  AUTH_REGISTER: {
    route: '/auth/register',
    method: 'POST',
    payload: {} as AuthPayload,
    response: null as AuthResponse,
  },
  TM_REQUEST: {
    route: '/events.json',
    method: 'GET',
    payload: null,
    response: null as TicketMasterResponse | null, 
  },
} as const;

export type ValidServerEndpoints = keyof typeof API_SCHEMA;

export type EndpointPayload<E extends ValidServerEndpoints> = (typeof API_SCHEMA)[E]['payload'];

export type EndpointResponse<E extends ValidServerEndpoints> = (typeof API_SCHEMA)[E]['response'];
