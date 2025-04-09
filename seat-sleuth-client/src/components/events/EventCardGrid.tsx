import { useState, useEffect } from 'react';
import { Grid, Text, Center, Transition } from '@mantine/core';
import EventCard from '../events/EventCard';
import EventCardSkeleton from '../events/EventCardSkeleton';
import { useAppropriateGridColumnCount } from '../../hooks/hooks';
import { EventMetaData } from '@client/types/shared/responses';

interface EventCardGridProps {
  events?: EventMetaData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export default function EventCardGrid({ events, isLoading, isError, error }: EventCardGridProps) {
  const COL_SPAN = useAppropriateGridColumnCount();
  const CARD_SLIDE_ANIMATION_DELAY = 25;
  const CARD_SLIDE_ANIMATION_DURATION = 250;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (events) {
      setTimeout(() => setMounted(true), CARD_SLIDE_ANIMATION_DURATION);
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
          <Grid.Col key={event.eventName} span={COL_SPAN}>
            <Transition
              mounted={mounted}
              transition="slide-right" // Check this out if you wanna change transition effect: https://mantine.dev/core/transition/
              duration={CARD_SLIDE_ANIMATION_DURATION}
              enterDelay={index * CARD_SLIDE_ANIMATION_DELAY}
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
