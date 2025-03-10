import { Container } from '@mantine/core';
import { ApiResponse, EventData, TicketMasterQueryResponse } from '@shared/api/responses';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useEffect } from 'react';
import { unsanitizeEventName, sanitizeEventName } from '../util/sanitization';

export default function EventDetails() {
  const { name, id } = useParams();
  const navigate = useNavigate();

  const formattedName: string = name ? unsanitizeEventName(name) : '';

  useEffect(() => {
    if (name && name !== sanitizeEventName(formattedName)) {
      const newUrl = `/events/${sanitizeEventName(formattedName)}${id ? `/${id}` : ''}`;
      navigate(newUrl, { replace: true });
    }
  }, [name, id, navigate, formattedName]);

  const { data: event } = useQuery<EventData | null, Error>(
    ['eventWithOptions', formattedName],
    async () => {
      if (id) {
        const res: ApiResponse<TicketMasterQueryResponse> = await fetchTicketMasterEvents({
          id,
        });
        const eventData: EventData | null = res?.data?.[0] ?? null;
        if (eventData) {
          return eventData;
        }
      } else if (formattedName) {
        const res = await fetchTicketMasterEvents({ keyword: formattedName });
        const eventData: EventData | null = res?.data?.[0] ?? null;
        if (eventData) {
          return eventData;
        }
      }
      navigate(`/404`);
      return null;
    },
    { enabled: !!formattedName },
  );

  return (
    <Container fluid w="100%" p={0} m={0}>
      {/* TODO: @Veda Render event details */}
      {event && JSON.stringify(event)}
    </Container>
  );
}
