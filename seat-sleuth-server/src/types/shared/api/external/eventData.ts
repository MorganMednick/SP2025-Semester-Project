// Defines the data that we want for any event. No matter how we get it lol... -Jayce
export interface EventData {
  price_min?: number;
  price_max?: number;
  event_name: string;
  seat_location?: string;
  event_location?: string;
  start_time: string;
  venue_seat_map?: string;
  tm_link?: string;
  event_type?: string;
}
