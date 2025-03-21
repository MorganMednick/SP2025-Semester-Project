import axios from 'axios';
import { SG_BASE_URL, SG_CLIENT_ID } from './env';

export const seatGeekApiClient = axios.create({
  baseURL: SG_BASE_URL,
  params: { client_id: SG_CLIENT_ID },
  headers: { 'Content-Type': 'application/json' },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logRequest(config: any) {
  const fullUrl = `${config.baseURL}${config.url}?${new URLSearchParams(config.params as Record<string, string>)}`;
  console.log(`[SeatGeek API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
  return config;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleErrorResponse(error: any) {
  const status = error?.response?.status || 'UNKNOWN';
  const statusText = error?.response?.statusText || 'No status text';
  const requestUrl = error?.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL';

  return Promise.reject({
    status,
    request: `${error.config?.method?.toUpperCase()} ${requestUrl}`,
    statusText,
  });
}

seatGeekApiClient.interceptors.request.use(logRequest);
seatGeekApiClient.interceptors.response.use((response) => response, handleErrorResponse);
