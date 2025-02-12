import { TicketMasterResponse } from "@shared/api/ticketMasterResponse";

export const parseData: (ticketdata: any) => TicketMasterResponse | undefined = (ticketdata) => {
  if (!ticketdata || !ticketdata._embedded || !ticketdata._embedded.events || ticketdata._embedded.events.length === 0) {
    console.warn("Invalid or missing event data:", ticketdata);
    return undefined;
    };
    return {
      price_min: ticketdata._embedded.events[0].priceRanges[0].min,
      price_max: ticketdata._embedded.events[0].priceRanges[0].max,
      event_name: ticketdata._embedded.events[0].name,
      seat_location: "", //TODO
      event_location: ticketdata._embedded.events[0].products[0].name,
      start_time: ticketdata._embedded.events[0].dates.start,
      venue_seat_map: ticketdata._embedded.events[0].seatmap.staticUrl,
      tm_link: ticketdata._embedded.events[0].products[0].url,
      event_type: ticketdata._embedded.events[0].classifications[0].genre.name,
    };
  };