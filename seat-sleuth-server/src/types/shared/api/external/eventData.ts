// Defines the data that we want for any event. No matter how we get it lol... -Jayce
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
