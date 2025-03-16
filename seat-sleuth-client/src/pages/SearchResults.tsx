import { useQuery } from 'react-query';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { useParams } from 'react-router-dom';
import { TicketMasterQueryResponse } from '@shared/api/responses';
import EventCardGrid from '../components/events/EventCardGrid';
import { useGeoPoint } from '../hooks/hooks';
import PageLayout from '../components/layout/PageLayout';
import { useMemo } from 'react';

export default function SearchResults() {
  const { q } = useParams();
  const { geoPoint } = useGeoPoint();

  const searchParams = useMemo<TicketMasterSearchParams>(
    () => ({
      keyword: q || '',
      geoPoint: geoPoint || '',
    }),
    [q, geoPoint],
  );

  const isQueryEnabled = Boolean(searchParams.keyword && geoPoint);

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery<TicketMasterQueryResponse, Error>(
    ['ticketMasterEvents', searchParams],
    async () => {
      const res = await fetchTicketMasterEvents(searchParams);
      return res?.data || [];
    },
    {
      enabled: isQueryEnabled,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <PageLayout>
      <EventCardGrid events={events} isLoading={isLoading} isError={isError} error={error} />
    </PageLayout>
  );
}
