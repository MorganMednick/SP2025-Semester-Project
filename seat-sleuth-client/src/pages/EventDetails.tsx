import { ApiResponse, EventData, TicketMasterQueryResponse } from '@shared/api/responses';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { sanitizeEventName, unsanitizeEventName } from '../util/sanitization';
import EventDetailsImageSection from '../components/events/EventDetailsImageSection';
import EventDetailsInfoSection from '../components/events/EventDetailsInfoSection';
import { fetchSeatGeekEventUrl } from '../api/functions/seatGeek';

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

  const {data: seatGeekUrl} = useQuery<string | null, Error>(
    ['seatGeekEvent', name],
    async () => {
      if(event?.instanceCount?? 0 > 0){
        const res = await fetchSeatGeekEventUrl({ q: sanitizedName, "venue.city": event?.instances[0].city});
        return res?.data || "NOT FOUND";
      }
      else{
        return null;
      }
      
    },
  );

  console.log("fetched seat geek url: ", seatGeekUrl);

  // TODO: Actually render the page
  return <PageLayout>
    < EventDetailsImageSection  event={event} isLoading={isLoading} isError={isError} />
    <EventDetailsInfoSection event={event} isLoading={isLoading} isError={isError} />
  </PageLayout>;
}
