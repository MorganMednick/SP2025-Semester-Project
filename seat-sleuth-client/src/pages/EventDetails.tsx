import { Container } from '@mantine/core';
import { EventData } from '@shared/api/external/eventData';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
export default function EventDetails() {
  const { id } = useParams();
  const {
    data: events,
  } = useQuery<EventData[], Error>(['ticketMasterEvents', id], async () => {
    const params: TicketMasterSearchParams = {
      id,
    };
    const res = await fetchTicketMasterEvents(params);
    return res.data || [];
  });
  return (
    <Container size="lg" py="xl">
      {JSON.stringify(events)}
    </Container>
  );
}

//TODO: MORGAN Pass the parsed data from homepage to this eventpage.
