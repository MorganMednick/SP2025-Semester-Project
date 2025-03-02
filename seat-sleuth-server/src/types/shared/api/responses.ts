import { User, Event, UserWatchlist, WatchedPrice } from '@prisma/client';

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

export type UserWithWatchList =
  | (User & {
      watchlist: (UserWatchlist & { event: Event; watchedPrices: WatchedPrice[] })[];
    })
  | null;

export interface UserWatchListEntry {
  event: Event;
  watchedPrices: WatchedPrice[];
}

export type { User, Event };
