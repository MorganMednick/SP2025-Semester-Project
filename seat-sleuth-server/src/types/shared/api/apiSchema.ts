import { User } from '@prisma/client';
import {
  AddToWatchListPayload,
  AuthPayload,
  UpdatePasswordPayload,
  RemoveFromWatchListPayload,
  UserPayload,
  TicketMasterQueryParams,
  IsUserWatchingPayload,
} from './payloads';
import { AuthResponse, GetWatchlistForUserResponse, TicketMasterQueryResponse } from './responses';

export type HttpMethodsAllowed = 'GET' | 'POST' | 'DELETE' | 'PUT';

/**
 * Defines the valid API endpoints and their respective request payloads and responses.
 */
export const AUTH_API_SCHEMA = {
  HEALTH: {
    route: '/health',
    method: 'GET',
    payload: null,
    response: {},
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
    payload: {} as TicketMasterQueryParams,
    response: {} as TicketMasterQueryResponse,
  },
} as const;

export const USER_API_SCHEMA = {
  GET_USER_INFO: {
    route: '/user/info',
    method: 'GET',
    payload: null,
    response: {} as User,
  },
  UPDATE_USER_INFO: {
    route: '/user/info',
    method: 'PUT',
    payload: {} as UserPayload,
    response: null,
  },
  UPDATE_PASSWORD: {
    route: '/user/password',
    method: 'PUT',
    payload: {} as UpdatePasswordPayload,
    response: null,
  },
} as const;

export const WATCHLIST_API_SCHEMA = {
  GET_WATCHLIST: {
    route: '/watchlist',
    method: 'GET',
    payload: null,
    response: {} as GetWatchlistForUserResponse,
  },
  ADD_TO_WATCHLIST: {
    route: '/watchlist',
    method: 'POST',
    payload: {} as AddToWatchListPayload,
    response: null,
  },
  REMOVE_FROM_WATCHLIST: {
    route: '/watchlist',
    method: 'DELETE',
    payload: {} as RemoveFromWatchListPayload,
    response: null,
  },
  CHECK_IF_USER_WATCHING: {
    route: '/watchlist/check',
    method: 'POST',
    payload: {} as IsUserWatchingPayload,
    response: null,
  },
} as const;

export const MERGED_API_SCHEMA = {
  ...AUTH_API_SCHEMA,
  ...TM_API_SCHEMA,
  ...USER_API_SCHEMA,
  ...WATCHLIST_API_SCHEMA,
} as const;

export type ValidServerEndpoints = keyof typeof MERGED_API_SCHEMA;

export type EndpointPayload<E extends ValidServerEndpoints> =
  (typeof MERGED_API_SCHEMA)[E]['payload'];

export type EndpointResponse<E extends ValidServerEndpoints> =
  (typeof MERGED_API_SCHEMA)[E]['response'];
