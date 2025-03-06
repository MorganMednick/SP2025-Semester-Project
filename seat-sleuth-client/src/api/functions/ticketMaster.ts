import { handleServerRequest } from '../apiClient';
import { ApiResponse, TicketMasterQueryResponse } from '@shared/api/responses';
import { TicketMasterQueryParams } from '@shared/api/payloads';

export const fetchTicketMasterEvents = (
  params?: TicketMasterQueryParams,
): Promise<ApiResponse<TicketMasterQueryResponse>> => {
  return handleServerRequest('TM_EVENTS', params);
};
