import { seatGeekApiClient } from '../config/sgClient';
import { SeatGeekApiResponse, SeatGeekSearchParams } from '../types/shared/api/external/seatGeek';

export const handleSeatGeekEventRequest = async (
  params: SeatGeekSearchParams,
): Promise<string> => {
  try {
    const response = await seatGeekApiClient.get('events', { params });
    const eventsData: SeatGeekApiResponse = response.data;
    const eventUrl = eventsData?.events.length > 0 ? eventsData?.events[0].url : "";
    return eventUrl;
  } catch (error) {
    console.error(`Failed to fetch events from SeatGeek: ${error}`);
    throw new Error('Failed to fetch events');
  }
};  
