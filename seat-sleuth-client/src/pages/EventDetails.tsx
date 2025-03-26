import { ApiResponse, EventData, TicketMasterQueryResponse } from '@shared/api/responses';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { sanitizeEventName, unsanitizeEventName } from '../util/sanitization';
import EventDetailsImageSection from '../components/events/EventDetailsImageSection';
import EventDetailsInfoSection from '../components/events/EventDetailsInfoSection';

export default function EventDetails() {
  const { name, id } = useParams();
  const sanitizedName = sanitizeEventName(name || '');
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState<string>(id || '');

  useEffect(() => {
    if (name) {
      if (sanitizedName !== name) {
        const newUrl = `/events/${sanitizedName}${id ? `/${id}` : ''}`;
        if (newUrl !== window.location.pathname) {
          navigate(newUrl, { replace: true });
        }
      }
    }
  }, [name]);

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery<EventData | null, Error>(
    ['eventWithOptions', name, id],
    async () => {
      if (id) {
        const res: ApiResponse<TicketMasterQueryResponse> = await fetchTicketMasterEvents({
          id,
        });
        setSelectedEventId(id);
        return res?.data?.[0] ?? null;
      }

      if (name) {
        const res = await fetchTicketMasterEvents({ keyword: unsanitizeEventName(name) });
        setSelectedEventId(res?.data?.[0]?.instances?.[0]?.ticketMasterId || ''); // Arbitrarily assign first ID up front -- This state is required for refetch
        return res?.data?.[0] ?? null;
      }

      return null;
    },
    {
      enabled: (!!name && sanitizedName === name) || !!id,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onError: () => {
        navigate('/404'); // Failed fetch treadted as event not found error
      },
    },
  );
  return (
    <PageLayout>
      <EventDetailsImageSection selectedEventId={selectedEventId} event={event} />
      <EventDetailsInfoSection
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        event={event}
        isLoading={isLoading}
        isError={isError}
      />
    </PageLayout>
  );
}
