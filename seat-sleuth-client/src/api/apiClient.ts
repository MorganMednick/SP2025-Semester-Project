import { API_ENDPOINTS } from '@client/types/shared/api';
import {
  EndpointPayload,
  EndpointResponse,
  ValidServerEndpoints,
} from '@client/types/shared/apiSchema';
import { ApiResponse, ApiErrorResponse } from '@client/types/shared/responses';
import axios, { AxiosError, AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export const handleServerRequest = async <E extends ValidServerEndpoints>(
  endpoint: E,
  payload?: EndpointPayload<E>,
): Promise<ApiResponse<EndpointResponse<E>>> => {
  const { route, method } = API_ENDPOINTS[endpoint];

  return apiClient
    .request<ApiResponse<EndpointResponse<E>>>({
      method,
      url: route,
      data: payload ?? {},
    })
    .then((res) => res?.data)
    .catch((err) => {
      const error = err as AxiosError;
      return Promise.reject(error.response?.data as ApiErrorResponse<null>);
    });
};
