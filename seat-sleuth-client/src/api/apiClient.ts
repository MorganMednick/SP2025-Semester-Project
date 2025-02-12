import { API_ENDPOINTS } from '@shared/api/api';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiErrorResponse, ApiResponse } from '@shared/api/responses';
import { ValidServerEndpoints, EndpointPayload, EndpointResponse } from '@shared/api/apiSchema';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const ticketMasterApiClient: AxiosInstance = axios.create({ 
  baseURL: import.meta.env.VITE_TM_BASE_URL || 'https://app.ticketmaster.com/discovery/v2/',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * A generic API request handler ensuring strict type safety.
 *
 * @template E - The endpoint key from `ValidServerEndpoints`.
 * @param endpoint - The API endpoint key.
 * @param payload - The request body (must match the endpoint's expected payload).
 * @returns A promise resolving to `ApiResponse` with the expected response type.
 */
export const handleServerRequest = async <E extends ValidServerEndpoints>(endpoint: E, payload?: EndpointPayload<E>): Promise<ApiResponse<EndpointResponse<E>>> => {
  const { route, method } = API_ENDPOINTS[endpoint];

  return apiClient
    .request<ApiResponse<EndpointResponse<E>>>({
      method,
      url: route,
      data: payload ?? undefined,
    })
    .then((res) => res?.data)
    .catch((err) => {
      const error = err as AxiosError;
      return error.response?.data as ApiErrorResponse<null>;
    });
};


/**
 * A generic API request handler ensuring strict type safety.
 *
 * @template E - The endpoint key from `ValidServerEndpoints`.
 * @param endpoint - The API endpoint key.
 * @param payload - The request body (must match the endpoint's expected payload).
 * @returns A promise resolving to `ApiResponse` with the expected response type.
 */
export const handlleTicketMasterRequest = async <E extends ValidServerEndpoints>(endpoint: E, payload?: EndpointPayload<E>): Promise<ApiResponse<EndpointResponse<E>>> => {
  const { route, method } = API_ENDPOINTS[endpoint];

  return ticketMasterApiClient
    .request<ApiResponse<EndpointResponse<E>>>({
      method,
      url: `${route}?apiKey=${import.meta.env.VITE_TM_API_KEY}`,
      data: payload ?? undefined,
    })
    .then((res) => res?.data)
    .catch((err) => {
      const error = err as AxiosError;
      return error.response?.data as ApiErrorResponse<null>;
    });
};
