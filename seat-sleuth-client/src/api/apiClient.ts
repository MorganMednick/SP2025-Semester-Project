import { ValidServerEndpoints } from '@shared/api/api';
import { ValidPayloads } from '@shared/api/payloads';
import { ValidApiResponses, ApiResponse } from '@shared/api/responses';
import { API_ENDPOINTS } from '@shared/api/api';
import axios, { AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http:localhost:5137',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * A generic API request handler ensuring type safety for endpoints, payloads, and responses.
 *
 * @template T - The expected response type.
 * @param endpoint - The API endpoint key from `ValidServerEndpoints`.
 * @param payload - The optional request body (must match `ValidPayloads`).
 * @returns A promise resolving to `ApiResponse<T>`.
 */
export const handleServerRequest = async <T = ValidApiResponses>(endpoint: ValidServerEndpoints, payload?: ValidPayloads): Promise<ApiResponse<T>> => {
  try {
    const { route, method } = API_ENDPOINTS[endpoint];

    const config = {
      method,
      url: route,
      data: payload ?? undefined,
    };

    const response = await apiClient.request<ApiResponse<T>>(config);

    return response.data;
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      error: error.response?.data?.error || error.message,
    } as ApiResponse<T>;
  }
};
