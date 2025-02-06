export interface ticketMasterResponse {
  price_min?: number; //_embedded.events[0].priceRanges[0].min
  price_max?: number; // _embedded.events[0].priceRanges[0].max
  event_name: string; //_embedded.events[0].name
  seat_location?: string; 
  event_location?: string; //_embedded.events[0].products[0].name
  start_time: string; //_embedded.events[0].dates.start
  venue_seat_map?: string; //_embedded.events[0].seatmap.staticUrl
}

//TODO: export { ticketMasterResponse };