import { useQuery } from 'react-query';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useParams } from 'react-router-dom';
import EventCard from '../components/events/EventCard';
import { Container, Grid } from '@mantine/core';
import { Event } from '@shared/api/responses';

export default function SearchResults() {
  const { q } = useParams();

  const searchParams: TicketMasterSearchParams = {
    keyword: q || '',
  };

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery<Event[], Error>(['ticketMasterEvents', searchParams], () =>
    fetchTicketMasterEvents(searchParams).then((res) => res.data || []),
  );

  if (isLoading) return <div>Loading events...</div>;
  if (isError) return <div>Error loading events: {error.message}</div>;

  return (
    <Container py="xl">
      <Grid gutter="xl" p="md">
        {events &&
          events.map((event) => (
            <Grid.Col key={event.id} span={6}>
              <EventCard event={event} />
            </Grid.Col>
          ))}
      </Grid>
    </Container>
  );
}
