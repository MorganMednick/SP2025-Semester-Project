import { AuthPayload } from './payloads';
import { AuthResponse } from './responses';
import { EventData } from './external/eventData';
import { TicketMasterSearchParams } from './external/ticketMaster';

export type HttpMethodsAllowed = 'GET' | 'POST' | 'DELETE' | 'PUT';

/**
 * Defines the valid API endpoints and their respective request payloads and responses.
 */
export const AUTH_API_SCHEMA = {
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
  AUTH_LOGOUT: {
    route: '/auth/logout',
    method: 'POST',
    payload: null,
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
} as const;

export const TM_API_SCHEMA = {
  TM_EVENTS: {
    route: '/tm/events',
    method: 'POST',
    payload: {} as TicketMasterSearchParams,
    response: {} as EventData[],
  },
} as const;

export const MERGED_API_SCHEMA = {
  ...AUTH_API_SCHEMA,
  ...TM_API_SCHEMA,
} as const;

export type ValidServerEndpoints = keyof typeof MERGED_API_SCHEMA;

export type EndpointPayload<E extends ValidServerEndpoints> = (typeof MERGED_API_SCHEMA)[E]['payload'];

export type EndpointResponse<E extends ValidServerEndpoints> = (typeof MERGED_API_SCHEMA)[E]['response'];
