import { useGeoPoint } from '../../hooks/hooks';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { Text } from '@mantine/core';
import { useQuery } from 'react-query';
import { TicketMasterQueryResponse } from '@shared/api/responses';
import EventCardGrid from '../events/EventCardGrid';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import PageLayout from '../layout/PageLayout';

export default function PopularNearYou() {
  const { geoPoint, geoPointFetching } = useGeoPoint();

  const {
    data: eventsNearYou,
    isLoading,
    isError,
    error,
  } = useQuery<TicketMasterQueryResponse, Error>(
    ['ticketMasterEvents', geoPoint],
    async () => {
      const nearMeParams: TicketMasterSearchParams = {
        geoPoint: geoPoint || '',
        radius: '40',
        unit: 'miles',
        sort: 'relevance,asc',
        size: '40',
        page: '1',
      };
      const res = await fetchTicketMasterEvents(nearMeParams);
      return res.data || [];
    },
    { enabled: !geoPointFetching },
  );

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
        events={eventsNearYou}
      />
    </PageLayout>
  );
}
