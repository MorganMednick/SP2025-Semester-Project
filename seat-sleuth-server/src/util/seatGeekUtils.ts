import {
    RawTMEventData,
    TicketMasterSearchParams,
  } from '../types/shared/api/external/ticketMaster';
  import { PriceOptionSource, PriceOption } from '@prisma/client';
  import {
    EventData,
    SpecificEventData,
    TicketMasterQueryResponse,
  } from '../types/shared/api/responses';
  import prisma from '../config/db';
  import { ticketMasterApiClient } from '../config/tmClient';
  import { logTicketMasterRequestInDatabase } from './dbUtils';
  import { StatusCodes } from 'http-status-codes';
import { seatGeekApiClient } from '../config/sgClient';
import { SeatGeekApiResponse, SeatGeekEvent, SeatGeekSearchParams } from '../types/shared/api/external/seatGeek';
  
  export const handleSeatGeekEventRequest = async (
    params: SeatGeekSearchParams,
  ): Promise<string> => {
    const eventsResponse = await fetchEventsFromSeatGeek(params);
    const eventUrl = eventsResponse.events.length > 0 ? eventsResponse.events[0].url : "";
    return eventUrl;
  };
  
  async function fetchEventsFromSeatGeek(
    params: SeatGeekSearchParams,
  ): Promise<SeatGeekApiResponse> {
    try {
      const response = await seatGeekApiClient.get('events', { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch events from SeatGeek: ${error}`);
      throw new Error('Failed to fetch events');
    }
  }
  
