import { useGeoPoint } from '../../hooks/hooks';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { Skeleton, Grid, Text, Card, Container } from '@mantine/core';
import EventCard from '../events/EventCard';
import { useQuery } from 'react-query';
import { Event } from '@shared/api/responses';

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
    <Container size="lg" py="xl">
      <Text size="xl" mb="md" style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Popular near you:
      </Text>

      {isError && (
        <Text c="red" ta="center">
          {error.message}
        </Text>
      )}

      {/* TODO: Clean this render up. It's so easy to make this responsive and clean  */}
      <Grid gutter="xl" p="md">
        {isLoading
          ? Array.from({ length: 8 }, (_, index: number) => (
              <Grid.Col key={index} span={3} style={{ display: 'flex' }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Skeleton height={250} />
                </Card>
              </Grid.Col>
            ))
          : eventsNearYou?.slice(0, 8).map((event: Event, index: number) => (
              <Grid.Col key={index} span={3} style={{ display: 'flex' }}>
                <EventCard event={event} />
              </Grid.Col>
            ))}
      </Grid>
    </Container>
  );
}
