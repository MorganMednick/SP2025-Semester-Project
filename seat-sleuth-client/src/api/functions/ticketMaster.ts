import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { handleServerRequest } from '../apiClient';
import { ApiResponse, EventWithOptions } from '@shared/api/responses';

export const fetchTicketMasterEvents = (
  params?: TicketMasterSearchParams,
): Promise<ApiResponse<EventWithOptions[]>> => {
  return handleServerRequest('TM_EVENTS', params);
};
