import { EMAIL_API_SCHEMA } from '@shared/api/apiSchema';
import axios from 'axios';

interface SendPriceAlertEmailPayload {
  userEmail: string;
  ticket_name: string;
  ticket_price: string;
}

export async function sendPriceAlertEmail(payload: SendPriceAlertEmailPayload) {
  return axios.post(EMAIL_API_SCHEMA.EMAIL_NOTIF.route, payload);
}
