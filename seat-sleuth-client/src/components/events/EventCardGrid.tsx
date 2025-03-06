import { useState, useEffect } from 'react';
import { EventWithOptions } from '@shared/api/responses';
import { Grid, Text, Center, Transition } from '@mantine/core';
import EventCard from '../events/EventCard';
import EventCardSkeleton from '../events/EventCardSkeleton';
import { useAppropriateGridColumnCount } from '../../hooks/hooks';

interface EventCardGridProps {
  events?: EventWithOptions[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export default function EventCardGrid({ events, isLoading, isError, error }: EventCardGridProps) {
  const COL_SPAN = useAppropriateGridColumnCount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (events) {
      setMounted(true);
    } else {
      setMounted(false);
    }
  }, [events]);

  if (isLoading) {
    return (
      <Grid gutter="xl" p="md">
        {Array.from({ length: 8 }, (_, index) => (
          <Grid.Col key={index} span={COL_SPAN}>
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
    <Grid gutter="xl" py="md">
      {events && events.length > 0 ? (
        events.map((event, index) => (
          <Grid.Col key={event.id} span={COL_SPAN}>
            <Transition
              mounted={mounted}
              transition="slide-right" // Check this out if you wanna change transition effect: https://mantine.dev/core/transition/
              duration={250}
              enterDelay={index * 25}
              timingFunction="ease"
            >
              {(styles) => (
                <div style={styles}>
                  <EventCard event={event} />
                </div>
              )}
            </Transition>
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
