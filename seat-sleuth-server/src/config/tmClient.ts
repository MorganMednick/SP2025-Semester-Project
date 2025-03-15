import axios from 'axios';
import { TM_BASE_URL, TM_API_KEY } from './env';

export const ticketMasterApiClient = axios.create({
  baseURL: TM_BASE_URL,
  params: { apikey: TM_API_KEY },
  headers: { 'Content-Type': 'application/json' },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logRequest(config: any) {
  const fullUrl = `${config.baseURL}${config.url}?${new URLSearchParams(config.params as Record<string, string>)}`;
  console.log(`[TicketMaster API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
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

ticketMasterApiClient.interceptors.request.use(logRequest);
ticketMasterApiClient.interceptors.response.use((response) => response, handleErrorResponse);
