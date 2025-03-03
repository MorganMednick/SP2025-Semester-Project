import { EmailNotificationPayload } from '@shared/api/payloads'
import { handleServerRequest } from '../apiClient';
import { ApiResponse } from '@shared/api/responses';

export const sendPriceDropEmail = (
  params: EmailNotificationPayload,
): Promise<ApiResponse<null>> => {
  return handleServerRequest('EMAIL_NOTIF', params);
};

