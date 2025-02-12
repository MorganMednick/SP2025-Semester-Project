// Strict typing as extracted from https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#anchor_find
export type TicketMasterSearchParams = {
  id?: string;
  keyword?: string;
  attractionId?: string;
  venueId?: string;
  postalCode?: string;
  latlong?: string; // @Deprecated
  radius?: string;
  unit?: 'miles' | 'km';
  source?: 'ticketmaster' | 'universe' | 'frontgate' | 'tmr';
  locale?: string;
  marketId?: string;
  startDateTime?: string;
  endDateTime?: string;
  includeTBA?: 'yes' | 'no' | 'only';
  includeTBD?: 'yes' | 'no' | 'only';
  includeTest?: 'yes' | 'no' | 'only';
  size?: string;
  page?: string;
  sort?:
    | 'name,asc'
    | 'name,desc'
    | 'date,asc'
    | 'date,desc'
    | 'relevance,asc'
    | 'relevance,desc'
    | 'distance,asc'
    | 'name,date,asc'
    | 'name,date,desc'
    | 'date,name,asc'
    | 'date,name,desc'
    | 'distance,date,asc'
    | 'onSaleStartDate,asc'
    | 'id,asc'
    | 'venueName,asc'
    | 'venueName,desc'
    | 'random';
  onsaleStartDateTime?: string;
  onsaleEndDateTime?: string;
  city?: string[];
  countryCode?: string;
  stateCode?: string;
  classificationName?: string[];
  classificationId?: string[];
  dmaId?: string;
  localStartDateTime?: string[];
  localStartEndDateTime?: string[];
  startEndDateTime?: string[];
  publicVisibilityStartDateTime?: string[];
  preSaleDateTime?: string[];
  onsaleOnStartDate?: string;
  onsaleOnAfterStartDate?: string;
  collectionId?: string[];
  segmentId?: string[];
  segmentName?: string[];
  includeFamily?: 'yes' | 'no' | 'only';
  promoterId?: string;
  genreId?: string[];
  subGenreId?: string[];
  typeId?: string[];
  subTypeId?: string[];
  geoPoint?: string;
  preferredCountry?: 'us' | 'ca';
  includeSpellcheck?: 'yes' | 'no';
  domain?: string[];
};
