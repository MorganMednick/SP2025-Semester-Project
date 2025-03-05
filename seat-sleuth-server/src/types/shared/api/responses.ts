import {
  User,
  Event,
  PriceOption,
  EventOption as PrismaEventOption,
  WatchedEvent,
} from '@prisma/client';

export interface ApiResponse<T> {
  data?: T;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  statusCode: number;
}

export type ApiSuccessResponse<T> = Omit<ApiResponse<T>, 'error'>;
export type ApiErrorResponse<T> = Omit<ApiResponse<T>, 'data'>;
export type AuthResponse = null;

export interface EventOptionData extends PrismaEventOption {
  event: Event;
  priceOptions: PriceOption[];
}

export interface EventWithOptions extends Event {
  options: EventOptionData[];
}

export interface UserWithWatchlist extends User {
  watchlist: (WatchedEvent & { eventOption: EventOptionData })[];
}

export type { User, Event };
