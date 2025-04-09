import { TicketMasterQueryParams } from '@client/types/shared/payloads';
import { handleServerRequest } from '../apiClient';
import { ApiResponse, EventData } from '@client/types/shared/responses';

export const fetchTicketMasterEvents = (
  params?: TicketMasterQueryParams,
): Promise<ApiResponse<EventData[]>> => {
  return handleServerRequest('TM_EVENTS', params);
};
