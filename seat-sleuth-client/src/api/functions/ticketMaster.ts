import { handleServerRequest } from '../apiClient';
import {
  ApiResponse,
  TicketMasterQueryResponse,
} from '../../../../seat-sleuth-server/src/types/shared/responses';
import { TicketMasterQueryParams } from '../../../../seat-sleuth-server/src/types/shared/payloads';

export const fetchTicketMasterEvents = (
  params?: TicketMasterQueryParams,
): Promise<ApiResponse<TicketMasterQueryResponse>> => {
  return handleServerRequest('TM_EVENTS', params);
};
