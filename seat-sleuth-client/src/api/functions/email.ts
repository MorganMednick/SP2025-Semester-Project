import { handleServerRequest } from '../apiClient';
import { EmailNotificationPayload } from '@shared/api/payloads';

export async function sendPriceAlertEmail(payload: EmailNotificationPayload) {
  return handleServerRequest('EMAIL_NOTIF', payload);
}

export async function sendAddToWatchlistEmail(payload: EmailNotificationPayload) {
  return handleServerRequest('WATCHLIST_NOTIF', payload);
}
