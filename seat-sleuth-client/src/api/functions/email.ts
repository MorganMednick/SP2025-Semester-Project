import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { handleServerRequest } from '../apiClient';
import { ApiResponse, EventInstance } from '@shared/api/responses';

export const fetchTicketMasterEvents = (
  params?: TicketMasterSearchParams,
): Promise<ApiResponse<Event[]>> => {
  return handleServerRequest('TM_EVENTS', params);
};
