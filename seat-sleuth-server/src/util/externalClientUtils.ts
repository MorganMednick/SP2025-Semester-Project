import axios from 'axios';
import { TM_API_KEY, TM_BASE_URL } from '../config/env';

export const ticketMasterApiClient = axios.create({
  baseURL: TM_BASE_URL,
  params: {
    apikey: TM_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

ticketMasterApiClient.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}?${new URLSearchParams(config.params as Record<string, string>)}`;
  console.log(`[TicketMaster API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
  return config;
});

ticketMasterApiClient.interceptors.response.use(
  (response) => {
    console.info(`[TicketMaster API Success] ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url} - STATUS: ${response.status}`);
    return response;
  },
  (error) => {
    const status = error?.response?.status || 'UNKNOWN';
    const statusText = error?.response?.statusText || 'No status text';
    const requestUrl = error?.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL';
    return Promise.reject({ status, request: `${error.config?.method?.toUpperCase()} ${requestUrl}`, statusText });
  },
);
