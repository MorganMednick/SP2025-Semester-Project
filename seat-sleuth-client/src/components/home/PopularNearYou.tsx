import { useGeoPoint } from '../../hooks/hooks';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { Text } from '@mantine/core';
import { useQuery, useQueryClient } from 'react-query';
import { EventData, EventMetaData } from '@shared/api/responses';
import EventCardGrid from '../events/EventCardGrid';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import PageLayout from '../layout/PageLayout';
import { stripInstancesFromEventData } from '../../util/apiUtils';

export default function PopularNearYou() {
  const { geoPoint, geoPointFetching } = useGeoPoint();
  const queryClient = useQueryClient();

  const queryKey = ['ticketMasterEvents', geoPoint];

  const {
    data: eventsNearYouMetaData,
    isLoading,
    isError,
    error,
  } = useQuery<EventMetaData[] | [], Error>(
    queryKey,
    async () => {
      const nearMeParams: TicketMasterSearchParams = {
        geoPoint: geoPoint || '',
        sort: 'relevance,asc',
        size: '40',
        page: '2',
        radius: '20',
        unit: 'miles',
      };

      const res = await fetchTicketMasterEvents(nearMeParams);
      const eventData: EventData[] | [] = res.data ?? [];
      return stripInstancesFromEventData(eventData);
    },
    {
      enabled: !!geoPoint && !geoPointFetching,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const prefetchData = async (radius: string) => {
    const prefetchParams: TicketMasterSearchParams = {
      geoPoint: geoPoint || '',
      sort: 'relevance,asc',
      size: '40',
      page: '2',
      radius,
      unit: 'miles',
    };

    await queryClient.prefetchQuery(['ticketMasterEvents', geoPoint, radius], async () => {
      const res = await fetchTicketMasterEvents(prefetchParams);
      const eventData: EventData[] | [] = res.data ?? [];
      return stripInstancesFromEventData(eventData);
    });
  };

  if (geoPoint) {
    prefetchData('10');
    prefetchData('50');
  }

  const isFetching = geoPointFetching || isLoading;

  return (
    <PageLayout>
      <Text size="xl" mb="md" style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {isFetching ? <>Fetching Popular Events Near You</> : <>Popular near you:</>}
      </Text>
      <EventCardGrid
        error={error}
        isLoading={isFetching}
        isError={isError}
        events={eventsNearYouMetaData}
      />
    </PageLayout>
  );
}
