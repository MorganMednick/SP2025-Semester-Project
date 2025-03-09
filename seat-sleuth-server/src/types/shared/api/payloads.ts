import { TicketMasterSearchParams } from './external/ticketMaster';

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
}

export interface RemoveFromWatchListPayload {
  eventInstanceId: string;
}

export type TicketMasterQueryParams = TicketMasterSearchParams;
