import { useEffect, useState } from 'react';
import { useGeoPoint } from '../../hooks/hooks';
import { EventData } from '@shared/api/external/eventData';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { Skeleton, Grid, Card, Image, Text, Button } from '@mantine/core';
import { TicketMasterResponse } from '@shared/api/ticketMasterResponse';

export default function PopularNearYou() {
  const { geoPoint } = useGeoPoint();
  const [eventsNearYou, setEventsNearYou] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (geoPoint) {
      const nearMeParams: TicketMasterSearchParams = {
        geoPoint: geoPoint || '',
        radius: '50',
        unit: 'miles',
        sort: 'relevance,desc',
        size: '40',
        page: '1',
      };

      setLoading(true);
      fetchTicketMasterEvents(nearMeParams)
        .then((res) => {
          console.log(JSON.stringify(res.raw)); //TODO: Remove when done
          setEventsNearYou(res.data || []);
        })
        .finally(() => setLoading(false));
    }
  }, [geoPoint]);

  return (
    <div>
      <Text size="xl" mb="md">
        Events near you:
      </Text>
      <Grid gutter="xl" p="md">
        {loading
          ? Array.from({ length: 4 }, (_, index: number) => (
              <Grid.Col key={index} span={4}>
                <Skeleton height={250} />
              </Grid.Col>
            ))
          : eventsNearYou.map((event: EventData, index: number) => (
              <Grid.Col key={index} span={4}>
                <EventCard event={event} />
              </Grid.Col>
            ))}
      </Grid>
    </div>
  );

  function EventCard({ event }: { event: TicketMasterResponse }) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src={event.image || 'https://via.placeholder.com/300'}
            height={160}
            alt={event.event_name}
          />
        </Card.Section>

        <Text size="lg" mt="md">
          {event.event_name}
        </Text>
        <Text size="sm" c="dimmed">
          {event.event_location || 'Location TBD'}
        </Text>
        <Text size="sm" c="dimmed">
          {event.start_time}
        </Text>

        {event.price_min && (
          <Text size="sm" mt="sm">
            Ticket Range: ${event.price_min} - ${event.price_max || 'N/A'}
          </Text>
        )}

        <Button component="a" href={event.tm_link} target="_blank" fullWidth mt="md">
          View Event Details
        </Button>
      </Card>
    );
  }
}
