import {
  Text,
  Container
} from '@mantine/core';
import { Event } from '@shared/api/responses';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import EventDetailsImageSection from '../components/events/EventDetailsImageSection';
import EventDetailsTicketCard from '../components/events/EventDetailsTicketCard';
import EventDetailsInfoSection from '../components/events/EventDetailsInfoSection';

export default function EventDetails() {
  const { id } = useParams();
  const { data: events,
 } = useQuery<Event[], Error>(['ticketMasterEvents', id], async () => {
    const params: TicketMasterSearchParams = { id };
    const res = await fetchTicketMasterEvents(params);
    return res.data || [];
  });

  if (!events || events.length === 0) {
    return <Text ta="center">Event not found.</Text>;
  }

  const event = events[0];

  return (
    <Container fluid w="100%" p={0} m={0}>
      <EventDetailsImageSection name={event.name} image={event.imageSrc} />
      <EventDetailsInfoSection
        startTime={event.startTime}
        venueMap={event.venueSeatMapSrc}
        venue={event.venueName}
        city={event.city}
      />
      <EventDetailsTicketCard priceMin={event.priceMin} url={event.url} />
    </Container>
  );
}
