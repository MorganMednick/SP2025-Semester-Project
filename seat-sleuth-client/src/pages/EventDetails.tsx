import { ApiResponse, EventData, TicketMasterQueryResponse } from '@shared/api/responses';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { sanitizeEventName, unsanitizeEventName } from '../util/sanitization';

export default function EventDetails() {
  const { name, id } = useParams();
  const sanitizedName = sanitizeEventName(name || '');
  const navigate = useNavigate();

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

  const { data: event } = useQuery<EventData | null, Error>(
    ['eventWithOptions', name, id],
    async () => {
      if (id) {
        const res: ApiResponse<TicketMasterQueryResponse> = await fetchTicketMasterEvents({
          id,
        });
        return res?.data?.[0] ?? null;
      }

      if (name) {
        const res = await fetchTicketMasterEvents({ keyword: unsanitizeEventName(name) });
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
        navigate('/404');
      },
    },
  );
  // TODO: Actually render the page
  return <PageLayout>{event ? JSON.stringify(event) : 'No Event Found'}</PageLayout>;
}
