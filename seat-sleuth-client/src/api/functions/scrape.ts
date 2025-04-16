import { ScrapingPricePayload } from '@client/types/shared/payloads';
import { ApiResponse, ScrapingPriceResponse } from '@client/types/shared/responses';
import { handleServerRequest } from '../apiClient';

export const getPriceForStubHubViaScraping = (
  payload: ScrapingPricePayload,
): Promise<ApiResponse<ScrapingPriceResponse>> => {
  return handleServerRequest('SCRAPE_STUB_HUB', payload);
};

export const getPriceForVividSeatsViaScraping = (
  payload: ScrapingPricePayload,
): Promise<ApiResponse<ScrapingPriceResponse>> => {
  return handleServerRequest('SCRAPE_VIVID_SEATS', payload);
};
