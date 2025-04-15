import { useGeoPoint } from '../../hooks/hooks';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { Title } from '@mantine/core';
import { useQuery } from 'react-query';
import { EventData, EventMetaData } from '@client/types/shared/responses';
import EventCardGrid from '../events/EventCardGrid';
import { TicketMasterSearchParams } from '@client/types/shared/ticketMaster';
import PageLayout from '../layout/PageLayout';
import { stripInstancesFromEventData } from '../../util/apiUtils';

export default function PopularNearYou() {
  const { geoPoint, geoPointFetching } = useGeoPoint();

  const queryKey = ['ticketMasterEvents', geoPoint];

  const {
    data: eventsNearYouMetaData,
    isLoading,
    isError,
    error,
  } = useQuery<EventMetaData[] | [], Error>(
    queryKey,
    async () => {
      if (!geoPoint) return [];

      const params: TicketMasterSearchParams = {
        geoPoint,
        sort: 'relevance,asc',
        size: '40',
        page: '2',
        radius: '20',
        unit: 'miles',
      };

      const res = await fetchTicketMasterEvents(params);
      const eventData: EventData[] | [] = res.data ?? [];
      return stripInstancesFromEventData(eventData);
    },
    {
      enabled: !!geoPoint,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const isFetching = geoPointFetching || isLoading;

  return (
    <PageLayout>
      <Title order={2}>
        {isFetching ? <>Fetching Popular Events Near You</> : <>Popular near you</>}
      </Title>
      <EventCardGrid
        error={error}
        isLoading={isFetching}
        isError={isError}
        events={eventsNearYouMetaData}
      />
    </PageLayout>
  );
}
