import { useGeoPoint } from '../../hooks/hooks';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { Text, Container } from '@mantine/core';
import { useQuery } from 'react-query';
import { Event } from '@shared/api/responses';
import EventCardGrid from '../events/EventCardGrid';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import PageLayout from '../layout/PageLayout';

export default function PopularNearYou() {
  const { geoPoint } = useGeoPoint();

  const {
    data: eventsNearYou,
    isLoading,
    isError,
    error,
  } = useQuery<Event[], Error>(
    ['ticketMasterEvents', geoPoint],
    async () => {
      const nearMeParams: TicketMasterSearchParams = {
        geoPoint: geoPoint || '',
        radius: '50',
        unit: 'miles',
        sort: 'relevance,desc',
        size: '40',
        page: '1',
      };
      const res = await fetchTicketMasterEvents(nearMeParams);
      return res.data || [];
    },
    { enabled: !!geoPoint },
  );

  return (
    <PageLayout>
      <Text size="xl" mb="md" style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {isLoading ? <>Fetching Popular Events Near You</> : <>Popular near you:</>}
      </Text>
      <EventCardGrid error={error} isLoading={isLoading} isError={isError} events={eventsNearYou} />
    </PageLayout>
  );
}
