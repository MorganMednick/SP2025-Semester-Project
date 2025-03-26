import { User, WatchedEvent, PriceOption, EventMetaData, EventInstance } from '@prisma/client';

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

/**
 * @property {string} eventName - The name of the event.
 * @property {string | null} genre - The genre of the event.
 * @property {string | null} coverImage - Cover image for the event.
 * @property {SpecificEventData[]} options - The available options for the event. @see SpecificEventData
 * @description Represents an event with multiple options. This is essential to our model because we need to store the event options separately from the event metadata.
 */
export type EventData = EventMetaData & {
  instances: SpecificEventData[];
};

/**
 * @property {string} ticketMasterId - The Ticketmaster ID for the event option.
 * @property {string} eventName - Name of the specific event option.
 * @property {string} venueName - Name of the venue.
 * @property {string} address - Address of the venue.
 * @property {string | null} seatMapSrc - URL to the seat map.
 * @property {string} city - City of the event.
 * @property {string} country - Country of the event.
 * @property {string | null} url - URL to the event details.
 * @property {string | null} currency - Currency for the pricing.
 * @property {Date} startTime - Start time of the event.
 * @property {Date | null} saleStart - Sale start time.
 * @property {Date | null} saleEnd - Sale end time.
 * @property {WatchedEventData[]} watchers - List of users watching this event. @see WatchedEventData
 * @property {PriceOption[]} priceOptions - List of pricing options. @see PriceOption
 */
export type SpecificEventData = EventInstance & {
  watchers: WatchedEventData[];
  priceOptions: PriceOption[];
};

/**
 * @property {number} userId - ID of the user watching the event.
 * @property {string} eventOptionId - ID of the event option being watched.
 * @property {User} user - User details.
 */
export type WatchedEventData = WatchedEvent & {
  user: User;
};

/**
 * @description Represents a list of events returned by the Ticketmaster API.
 */
export type TicketMasterQueryResponse = EventData[];

/**
 * @description Represents a list of events on the user's watchlist.
 */
export type GetWatchlistForUserResponse = EventData[];

export type { EventMetaData, EventInstance, User };
