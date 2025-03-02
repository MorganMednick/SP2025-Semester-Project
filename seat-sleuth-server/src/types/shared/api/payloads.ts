import { TicketSites } from "@prisma/client";

export interface AuthPayload {
  email: string;
  password: string;
}

export interface UserPayload {
  email: string;
  name: string;
  notif: boolean;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface AddToWatchListPayload {
  eventId: string;
  startingPrice: number;
  ticketSite: TicketSites;
}

export interface RemoveFromWatchListPayload {
  eventId: string;
}
