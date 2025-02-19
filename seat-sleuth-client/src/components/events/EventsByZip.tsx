import { useState } from 'react';
import { EventData } from '@shared/api/external/eventData';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { Skeleton, Grid, Text, TextInput, Button } from '@mantine/core';
import EventCard from './EventCard';

export default function EventsByZip() {
  const [zipCode, setZipCode] = useState('');
  const [eventsNearYou, setEventsNearYou] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchEvents = () => {
    if (zipCode) {
      const params: TicketMasterSearchParams = {
        postalCode: zipCode,
        radius: '50',
        unit: 'miles',
        sort: 'relevance,desc',
        size: '40',
        page: '1',
      };

      setLoading(true);
      fetchTicketMasterEvents(params)
        .then((res) => {
          setEventsNearYou(res.data || []);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div>
      <Text size="xl" mb="md">
        Events near you:
      </Text>
      <TextInput
        placeholder="Enter ZIP code"
        value={zipCode}
        onChange={(event) => setZipCode(event.currentTarget.value)}
        mb="md"
      />
      <Button onClick={fetchEvents} disabled={!zipCode || loading} mb="md">
        Search
      </Button>
      <Grid gutter="xl" p="md">
        {loading
          ? Array.from({ length: 4 }, (_, index: number) => (
              <Grid.Col key={index} span={3}>
                <Skeleton height={250} />
              </Grid.Col>
            ))
          : eventsNearYou.map((event: EventData, index: number) => (
              <Grid.Col key={index} span={3}>
                <EventCard event={event} />
              </Grid.Col>
            ))}
      </Grid>
    </div>
  );
}
