export interface TicketMasterResponse {
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

//ill want different types based on different scenarios. maybe we want a type that contains an array of instances of ticket pricing