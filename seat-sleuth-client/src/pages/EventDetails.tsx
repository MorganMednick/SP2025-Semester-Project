import { Text, Container } from '@mantine/core';
import { Event } from '@shared/api/responses';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import EventDetailsImageSection from '../components/events/EventDetailsImageSection';
import EventDetailsTicketCard from '../components/events/EventDetailsTicketCard';
import EventDetailsInfoSection from '../components/events/EventDetailsInfoSection';
import { useState } from 'react';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event>({} as Event);
  useQuery<Event, Error>(
    ['ticketMasterEvents', id],
    async () => {
      const params: TicketMasterSearchParams = { id };
      const res = await fetchTicketMasterEvents(params);
      const event: Event = res.data?.[0] || ({} as Event);
      setEvent(event);
      return event;
    },
    {
      enabled: true,
    },
  );

  if (!event) {
    return <Text ta="center">Event not found.</Text>;
  }

  return (
    <Container fluid w="100%" p={0} m={0}>
      <EventDetailsImageSection event={event} />
      <EventDetailsInfoSection event={event} setEvent={setEvent} />
      <EventDetailsTicketCard priceMin={event.priceMin} url={event.url} />
    </Container>
  );
}
