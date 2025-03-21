import { handleServerRequest } from '../apiClient';
import { ApiResponse } from '@shared/api/responses';
import { SeatGeekSearchParams } from '@shared/api/external/seatGeek';

export const fetchSeatGeekEventUrl = (
  params?: SeatGeekSearchParams
): Promise<ApiResponse<string>> => {
  return handleServerRequest('SG_EVENT', params);
};
