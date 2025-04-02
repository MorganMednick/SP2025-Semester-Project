import { StubHubScrapePayload } from '@shared/api/payloads';
import { handleServerRequest } from '../apiClient';
import { ApiResponse, StubHubScrapeResponse } from '@shared/api/responses';

export const fetchStubHubPrice = (
  query?: StubHubScrapePayload,
): Promise<ApiResponse<StubHubScrapeResponse>> => {
  return handleServerRequest('SCRAPE_STUBHUB', query);
};