// types/shared/api/external/email/sendPriceDropEmail.ts

export interface SendPriceDropEmailParams {
  emailType: string;
  userEmail: string;
  ticket_name: string;
  ticket_price: string;
}
