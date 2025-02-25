// Defines the data that we want for any event. No matter how we get it lol... -Jayce
// TODO: Jayce you are an absolute idiot. You need to delete this and pull directly from prisma. I can't believe you didn't think of that. This needs TO GO BYE BYE
export interface EventData {
  id: string;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  name: string;
  seatLocation?: string;
  startTime: string;
  saleStart?: string;
  saleEnd?: string;
  venueName?: string;
  venueAddressOne?: string;
  venueAddressTwo?: string;
  venueSeatMapSrc?: string;
  city: string;
  country: string;
  url?: string;
  genre?: string;
  imageSrc?: string[];
}
