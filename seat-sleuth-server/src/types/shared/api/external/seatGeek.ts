export interface SeatGeekSearchParams {
    q?: string,
    "venue.city"?: string;
}

export interface SeatGeekEvent {
    id: number;
    title: string;
    datetime_local: string;
    url: string;
    venue: {
      name: string;
      city: string;
      state: string;
    };
  };
  
export interface SeatGeekApiResponse {
    events: SeatGeekEvent[];
    meta: {
      total: number;
      page: number;
      per_page: number;
    };
};