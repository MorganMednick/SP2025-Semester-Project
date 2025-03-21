import { API_ENDPOINTS } from '@shared/api/api';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiErrorResponse, ApiResponse } from '@shared/api/responses';
import { ValidServerEndpoints, EndpointPayload, EndpointResponse } from '@shared/api/apiSchema';

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
      data: payload ?? undefined,
    })
    .then((res) => res?.data)
    .catch((err) => {
      console.log(method, route, payload); //TODO: Morgan Remove this
      console.log('handleServerRequest error');
      const error = err as AxiosError;
      return Promise.reject(error.response?.data as ApiErrorResponse<null>);
    });
};
