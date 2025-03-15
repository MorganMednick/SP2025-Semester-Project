import { ApiResponse, EventData, TicketMasterQueryResponse } from '@shared/api/responses';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useMemo, useEffect } from 'react';
import { unsanitizeEventName, sanitizeEventName } from '../util/sanitization';
import PageLayout from '../components/layout/PageLayout';

export default function EventDetails() {
  const { name, id } = useParams();
  const navigate = useNavigate();

  const formattedName = useMemo(
    () => (name ? encodeURIComponent(unsanitizeEventName(name)) : ''),
    [name],
  );

  useEffect(() => {
    if (name && name !== sanitizeEventName(decodeURIComponent(formattedName))) {
      const newUrl = `/events/${sanitizeEventName(decodeURIComponent(formattedName))}${id ? `/${id}` : ''}`;
      if (newUrl !== window.location.pathname) {
        navigate(newUrl, { replace: true });
      }
    }
  }, [name, id, navigate, formattedName]);

  const queryKey = useMemo(() => ['eventWithOptions', formattedName, id], [formattedName, id]);

  const { data: event } = useQuery<EventData | null, Error>(
    queryKey,
    async () => {
      if (id) {
        const res: ApiResponse<TicketMasterQueryResponse> = await fetchTicketMasterEvents({
          id,
        });
        return res?.data?.[0] ?? null;
      }

      if (formattedName) {
        const res = await fetchTicketMasterEvents({ keyword: decodeURIComponent(formattedName) });
        return res?.data?.[0] ?? null;
      }

      return null;
    },
    {
      enabled: !!formattedName || !!id,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      onError: () => {
        navigate('/404');
      },
    },
  );
  // TODO: Actually render the page
  return <PageLayout>{event ? JSON.stringify(event) : 'No Event Found'}</PageLayout>;
}
