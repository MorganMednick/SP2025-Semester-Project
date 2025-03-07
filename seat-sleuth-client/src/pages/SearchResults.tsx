import { useQuery } from 'react-query';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useParams } from 'react-router-dom';
import { EventMetaData } from '@shared/api/responses';
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
  } = useQuery<EventMetaData, Error>(['ticketMasterEvents', searchParams], async() => {
    const res = await fetchTicketMasterEvents(searchParams);
    const metaData: EventMetaData[] | [] = res?.data?.map(({ options, ...rest }) => rest) || [];
    return metaData;
  });

  return (
    <PageLayout>
      <EventCardGrid events={events} isLoading={isLoading} isError={isError} error={error} />
    </PageLayout>
  );
}
