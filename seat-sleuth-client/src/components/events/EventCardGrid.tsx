import { Event } from '@shared/api/responses';
import { Grid, Text, Center } from '@mantine/core';
import EventCard from '../events/EventCard';
import EventCardSkeleton from '../events/EventCardSkeleton';
import { useIsMobile } from '../../hooks/hooks';

interface EventCardGridProps {
  events?: Event[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export default function EventCardGrid({ events, isLoading, isError, error }: EventCardGridProps) {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Grid gutter="xl" p="md">
        {Array.from({ length: 8 }, (_, index) => (
          <Grid.Col key={index} span={isMobile ? 12 : 6}>
            <EventCardSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  if (isError) {
    return (
      <Center py="xl">
        <Text c="red" size="lg" fw={500}>
          {error?.message || 'An error occurred while fetching events.'}
        </Text>
      </Center>
    );
  }

  return (
    <Grid gutter="xl" p="md">
      {events && events.length > 0 ? (
        events.map((event) => (
          <Grid.Col key={event.id} span={isMobile ? 12 : 6}>
            <EventCard event={event} />
          </Grid.Col>
        ))
      ) : (
        <Center py="xl">
          <Text size="lg" fw={500} c="dimmed">
            No events found.
          </Text>
        </Center>
      )}
    </Grid>
  );
}
