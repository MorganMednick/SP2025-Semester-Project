import { EventData } from '@shared/api/external/eventData';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { handleServerRequest } from '../apiClient';
import { ApiResponse } from '@shared/api/responses';

export const fetchTicketMasterEvents = (
  params?: TicketMasterSearchParams,
): Promise<ApiResponse<EventData[]>> => {
  return handleServerRequest('TM_EVENTS', params);
};
