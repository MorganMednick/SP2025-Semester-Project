import { useQuery } from 'react-query';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useParams } from 'react-router-dom';
import { Event, EventWithOptions, TicketMasterQueryResponse } from '@shared/api/responses';
import EventCardGrid from '../components/events/EventCardGrid';
import { useGeoPoint } from '../hooks/hooks';
import PageLayout from '../components/layout/PageLayout';

export default function SearchResults() {
  const { q } = useParams();
  const { geoPoint } = useGeoPoint();

  const searchParams: TicketMasterSearchParams = {
    keyword: q || '',
    geoPoint: geoPoint || '',
  };

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery<TicketMasterQueryResponse, Error>(['ticketMasterEvents', searchParams], () =>
    fetchTicketMasterEvents(searchParams).then((res) => res.data || []),
  );

  return (
    <PageLayout>
      <EventCardGrid events={events} isLoading={isLoading} isError={isError} error={error} />
    </PageLayout>
  );
}
