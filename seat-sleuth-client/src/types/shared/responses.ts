/**
 * @description This file has been duplicated for simplicity to not include prisma shit mf
 */
export interface ApiResponse<T> {
  data?: T;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  statusCode: number;
}

export type ApiSuccessResponse<T> = Omit<ApiResponse<T>, 'error'>;
export type ApiErrorResponse<T> = Omit<ApiResponse<T>, 'data'>;
export type AuthResponse = { userId: number } | null;

export interface User {
  id: number;
  email: string;
  name: string | null;
  notification: boolean;
  password: string;
  createdAt: Date;

  watchlist: { userId: number; eventInstanceId: string }[];
}

export interface EventData {
  eventName: string;
  genre: string | null;
  coverImage: string | null;
  instanceCount: number;
  instances: SpecificEventData[];
}

export type EventMetaData = Omit<EventData, 'instances'>;

export interface PriceOption {
  id: string;
  eventInstanceId: string;
  priceMin: number;
  priceMax: number;
  source: string;
}

export interface SpecificEventData {
  ticketMasterId: string;
  eventName: string;
  venueName: string;
  address: string;
  seatMapSrc: string | null;
  city: string;
  country: string;
  url: string | null;
  coverImage: string | null; 
  currency: string | null;
  startTime: Date;
  saleStart: Date | null;
  saleEnd: Date | null;
  watchers: WatchedEventData[];
  priceOptions: PriceOption[];
}

export interface WatchedEventData {
  eventInstanceId: string;
  userId: number;
  user: {
    name: string | null;
    id: number;
    email: string;
    notification: boolean;
    password: string;
    createdAt: Date;
  };
}

export interface ScrapingPriceResponse {
  price: number;
  url: string;
}
