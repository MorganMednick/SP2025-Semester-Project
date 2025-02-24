import { useGeoPoint } from '../../hooks/hooks';
import { EventData } from '@shared/api/external/eventData';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { Skeleton, Grid, Text, Card } from '@mantine/core';
import EventCard from '../events/EventCard';
import { useQuery } from 'react-query';

export default function PopularNearYou() {
  const { geoPoint } = useGeoPoint();

  const {
    data: eventsNearYou,
    isLoading,
    isError,
    error,
  } = useQuery<EventData[], Error>(
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
    <div>
      <Text size="xl" mb="md">
        Events near you:
      </Text>

      {isError && (
        <Text c="red" ta="center">
          {error.message}
        </Text>
      )}

      <Grid gutter="xl" p="md">
        {isLoading
          ? Array.from({ length: 4 }, (_, index: number) => (
              <Grid.Col key={index} span={3}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Skeleton height={250} />
                </Card>
              </Grid.Col>
            ))
          : eventsNearYou?.map((event: EventData, index: number) => (
              <Grid.Col key={index} span={3}>
                <EventCard event={event} />
              </Grid.Col>
            ))}
      </Grid>
    </div>
  );
}
