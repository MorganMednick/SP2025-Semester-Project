import { Container } from '@mantine/core';
import { EventData, SpecificEventData } from '@shared/api/responses';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useEffect, useState } from 'react';

export default function EventDetails() {
  const { name, id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<
    EventData | (SpecificEventData & { coverImage: string }) | null
  >(null);

  const formattedName = name ? name.replace(/-/g, ' ').replace(/_/g, '/') : '';

  useEffect(() => {
    if (name && name.includes(' ')) {
      const newUrl = `/events/${name.replace(/\s+/g, '-')}${id ? `/${id}` : ''}`;
      navigate(newUrl, { replace: true });
    }
  }, [name, id, navigate]);

  useQuery<void | null, Error>(
    ['eventWithOptions', formattedName],
    async () => {
      if (id) {
        const res = await fetchTicketMasterEvents({ id });
        const eventData: EventData | null = res?.data?.[0] ?? null;
        const specificEventData: SpecificEventData | null = res?.data?.[0]?.options?.[0] ?? null;
        if (specificEventData) {
          setEvent({
            ...specificEventData,
            coverImage: eventData?.coverImage ?? '',
          });
        }
      } else if (formattedName) {
        const res = await fetchTicketMasterEvents({ keyword: formattedName });
        const eventData: EventData | null = res?.data?.[0] ?? null;
        if (eventData) setEvent(eventData);
      }
    },
    { enabled: !!formattedName },
  );

  return (
    <Container fluid w="100%" p={0} m={0}>
      {event && JSON.stringify(event)}
      {/* Render event details */}
    </Container>
  );
}
