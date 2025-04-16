import { TicketMasterSearchParams } from './ticketMaster';
import { EventData } from './responses';

export interface AuthPayload {
  email: string;
  password: string;
}

export interface UserPayload {
  email: string;
  name: string;
  notification: boolean;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface AddToWatchListPayload {
  eventInstanceId: string;
  event: EventData;
}

export interface RemoveFromWatchListPayload {
  eventInstanceId: string;
}

export interface IsUserWatchingPayload {
  eventInstanceId: string;
}
export interface ScrapingPricePayload {
  eventName: string;
  eventDate: string;
}

export type TicketMasterQueryParams = TicketMasterSearchParams;
